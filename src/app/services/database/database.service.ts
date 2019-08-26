import { Injectable } from '@angular/core';
import { Entity, Field, EntityParams, RelationParams } from '../../classes/entity';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private entities = {};

  constructor() { }

  // Sets a new or existing entity to the values provided.
  set( name: string, data: Object[], fields: { [key:string]: Field } = null, params: EntityParams = {} ): void
  {
    // Invalid names are not something we can accept and adapt to silently. This is serious.
    if ( !/^[-_a-zA-Z0-9]+$/.test( name ) ) {
      throw "name '" + name + "' not allowed as entity name.";
    }
    
    this.getOrCreate( name ).setData( data, fields, params );

    const relations = ( "relations" in params ) ? params.relations : [];
    const autoRelate = ( "autoRelate" in params ) ? params.autoRelate : true; 
    if ( autoRelate ) {
      this.autoRelate( name, relations );
    } else {
      this.makeRelations( name, relations );
    }
  }

  // public delete (entityName: string ): void
  // {
  //   if ( entityName in this.entities ) {
  //     this.entities[entityName] = new Entity( entityName );
  //   }

  // }

  private getOrCreate( entityName: string ): Entity
  {
    if ( !( entityName in this.entities ) ) {
      this.entities[entityName] = new Entity( entityName );
    }

    return this.entities[entityName];
  }

  when( entityName: string ): Promise<void>
  {
    return this.getOrCreate( entityName ).isInitialized;
  }

  getWhen( entityName: string ): Promise<any[]>
  {
    return this.getOrCreate( entityName ).isInitialized
    .then(
      () => Promise.resolve( this.get( entityName ))
    );
  }

  find( entityName: string, value: any, key: string = "id" ): any
  {
    if ( !value || !( entityName in this.entities ) ) return null;
    return this.entities[ entityName ].find( value, key );
  }

  get( entityName: string, filter = "all", sortKey = "_default", reverse = false ): any[]
  {
    if ( !( entityName in this.entities ) ) return [];
    return this.entities[ entityName ].get( filter, sortKey, reverse );
  }

  getWhere ( entityName: string, key: string, value: any ): any[]
  {
    if ( !( entityName in this.entities ) ) return [];
    return this.entities[ entityName ].getWhere( key, value );
  }

  // Checks whether an entity exists and actually has data.
  has( entityName: string ): boolean
  {
    return this.get( entityName ).length > 0;
  }

  private getAllEntities(): Entity[]
  {
    const entities = [];
    for (let entity in this.entities) {
      if (this.entities.hasOwnProperty(entity)) {
        entities.push( this.entities[entity] );
      }
    }
    return entities;
  }

  dump(): void
  {
    console.log("ENTITIES IN DATABASE:");
    for (let entity of this.getAllEntities()) {
      console.log( entity );
    }
  }

  public empty( entityName: string ): void
  {
    if ( !( entityName in this.entities ) ) return;
    this.removeRelations( entityName );
    this.entities[ entityName ].reset();
  }

  private removeRelations( entityName: string ): void
  {
    for ( let relatedEntityName of this.entities[ entityName ].owningRelations ) {
      this.entities[ relatedEntityName ].removeInverseRelation( entityName );
    }
    for ( let relatedEntityName of this.entities[ entityName ].inverseRelations ) {
      this.entities[ relatedEntityName ].removeOwningRelation( entityName );
    }
  }
  

// make a one-to-many relation so that every element holds a javascript object reference to the related elements, on both the "one" and the "many" sides (creating an infinite recursion tree).
  private makeRelations( entityName: string, relationParamsArray: RelationParams[] ): void
  {
    // loop through every relation
    for ( let relationParam of relationParamsArray ) {
      // determine field names (show, show_id and shows)
      const relationField = relationParam.entityName[0].toLowerCase() + relationParam.entityName.slice(1);
      const relationIdField = relationField + "_id";
      const relationCollectionField = entityName[0].toLowerCase() + entityName.slice(1) + "s";

      // get all data for the owning side
      const data = this.entities[ entityName ].get(
        relationParam.sortKey, relationParam.sortReverse 
      );

      // check whether a relation actually exists. If there is a relation, we assume that every item has a related item.
      if ( !data.length || !(relationIdField in data[0]) ) continue;

      // relatedEntity is the "many" part of the relation. It is the entity that does not have the relation key (show_id)
      if ( !( relationParam.entityName in this.entities ) ) continue;
      const relatedEntity = this.entities[ relationParam.entityName ];
      // prepare for a new relation, meaning creating an empty array "shows" for every element.
      relatedEntity.newOwningRelation( entityName, relationCollectionField );
      this.entities[ entityName ].newInverseRelation( relationParam.entityName );

      // loop through the data for the "one" part of the relation, the owning side, which is the entity that holds the relation key (show_id)
      for ( let item of data ) {
        // when the related entity is specifically set to null, don't try to find it
        if (item[relationIdField] !== null) {
          // get the related "one" element "show" that "show_id" refers to
          const relatedItem = relatedEntity.find( item[relationIdField] );
          if (!relatedItem) {
            console.error("Related field " + relationIdField + " (entity " + relationParam.entityName + ") for the following instance of entity " + entityName + ":");
            console.error(item);
          }
          // push the "many" element to the "shows" array of the found "one" element
          relatedItem[relationCollectionField].push( item );
          // assign the "one" element to the "show" property of the "many" element
          item[relationField] = relatedItem;

        }
      }
    }
  }

  private autoRelate( entityName: string, relations: RelationParams[] = [] ): void
  {
    const entity = this.entities[ entityName ];
    if ( !entity.get().length ) return;
    for ( let key of Object.keys( entity.get()[0] ) ) {
      if ( key.slice(-3) === "_id" ) {
        const relatedEntityName = key[0].toUpperCase() + key.slice(1, -3);
        let existing = false;
        for ( let relation of relations ) {
          if ( relation.entityName == relatedEntityName ) existing = true;
        }
        if ( !existing ) relations.push( { entityName: relatedEntityName } );
      }
    }
    this.makeRelations( entityName, relations );

    // Try to make a relation to this entity from every already existing entity. The first thing that makeRelations() will do is check whether there is a relation.
    for ( let entity of this.getAllEntities()) {
      this.makeRelations( entity.name, [{ entityName: entityName }] );
    }

  }

// setJunction creates a many-to-many relation by inserting the actual related objects as arrays on both sides. It assumes a junction table in the form of an object where every key is an id for entity1 and the value is an array of ids for entity2. Unrelated items are given empty arrays.
  public setJunction( entity1: string, entity2: string, junctionSet: number[][]): void
  {
    let entity1Plural = entity1[0].toLowerCase() + entity1.slice(1) + "s";
    let entity2Plural = entity2[0].toLowerCase() + entity2.slice(1) + "s";

    // create empty arrays for both sides. The first side will anyways be given the arrays from the junction table later, but we also want non-related instances to have an empty array.
    this.get(entity1).forEach( (entity1: any) => {
      entity1[entity2Plural] = [];
    });
    this.get(entity2).forEach( (entity2: any) => {
      entity2[entity1Plural] = [];
    });

    // loop through the top level of the junction table, where the keys are ids for instances of entity 1.
    Object.keys(junctionSet).forEach( (id1: string) => {
      let instance1 = this.find(entity1, id1);
      // simply assign the whole junction array to the associated entity instance. The elements of the array will be transformed to the actual objects in the coming for loop.
      instance1[entity2Plural] = junctionSet[id1];
      for (let i = 0; i < junctionSet[id1].length; i++) {
        // get the entity instance for every element of every array, overwrite the id in the array with it, and add the corresponding related entity to its own array of relations.
        let instance2 = this.find(entity2, junctionSet[id1][i]);
        junctionSet[id1][i] = instance2;
        instance2[entity1Plural].push(instance1);
      }
    });
  }

}