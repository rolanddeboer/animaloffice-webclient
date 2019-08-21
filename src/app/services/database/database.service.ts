import { Injectable } from '@angular/core';
import { Entity, EntityParams, RelationParams } from '../../classes/entity';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private entities = {};

  constructor() { }

  // Sets a new or existing entity to the values provided.
  set( name: string, data: Object[], params: EntityParams = {} ): void
  {
    // Invalid names are not something we can accept and adapt to silently. This is serious.
    if ( !/^[-_a-zA-Z0-9]+$/.test( name ) ) {
      throw "name '" + name + "' not allowed as entity name.";
    }
    
    this.getOrCreate( name ).setData( data, params );

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

  get( entityName: string, sortKey: string = null, reverse = false ): any[]
  {
    if ( !( entityName in this.entities ) ) return [];
    return this.entities[ entityName ].get( sortKey, reverse );
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
      // determine field names (show, show_id and show)
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
        // get the related "one" element "show" that "show_id" refers to
        const relatedItem = relatedEntity.find( item[relationIdField] );
        // push the "many" element to the "shows" array of the found "one" element
        relatedItem[relationCollectionField].push( item );
        // assign the "one" element to the "show" property of the "many" element
        item[relationField] = relatedItem;
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

}