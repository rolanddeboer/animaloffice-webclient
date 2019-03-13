import { Injectable } from '@angular/core';
import { Entity, EntityParams, RelationParams } from '../../classes/entity';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public entities = {};

  constructor() { }

  add( name: string, data: Object[], params: EntityParams = {} ): void
  {
    if ( !/^[-_a-zA-Z0-9]+$/.test( name ) ) {
      throw "name '" + name + "' not allowed as entity name.";
    }
    this.entities[name] = new Entity( name, data, params );

    const relations = ( "relations" in params ) ? params.relations : [];
    const autoRelate = ( "autoRelate" in params ) ? params.autoRelate : true; 
    if ( autoRelate ) {
      this.autoRelate( name, relations );
    } else {
      this.makeRelations( name, relations );
    }
  }

  delete( name: string ): void
  {
    delete this.entities[name];
  }

  find( entityName: string, value: any, key: string = "id" ): any
  {
    return this.entities[ entityName ].find( value, key );
  }

  get( entityName: string, sortKey: string = null, reverse = false ): any[]
  {
    if ( !( entityName in this.entities ) ) return [];
    return this.entities[ entityName ].get( sortKey, reverse );
  }

  has( entityName: string ): boolean
  {
    return this.get( entityName ).length > 0;
  }


// make a one-to-many relation so that every element holds a javascript object reference to the related elements, on both the "one" and the "many" sides (creating an infinite recursion tree).
  makeRelations( entityName: string, relationParamsArray: RelationParams[] ): void
  {
    // loop through every relation
    for ( let relationParam of relationParamsArray ) {
      // determine field names (show, show_id and show)
      const relationField = relationParam.entityName[0].toLowerCase() + relationParam.entityName.slice(1);
      const relationIdField = relationField + "_id";
      const relationCollectionField = entityName[0].toLowerCase() + entityName.slice(1) + "s";

      // relatedEntity is the "many" part of the relation. It is the entity that does not have the relation key (show_id)
      const relatedEntity = this.entities[ relationParam.entityName ];
      // prepare for a new relation, meaning creating an empty array "shows" for every element.
      relatedEntity.newRelation( entityName, relationCollectionField );

      // get all data for the "one" part of the relation, which is the entity that holds the relation key (show_id)
      const data = this.entities[ entityName ].get(
        relationParam.sortKey, relationParam.sortReverse 
      );
      // and loop through it
      for ( let item of data ) {
        // get the related "one" element "show" that "show_id" refers to
        const relatedItem = relatedEntity.find( item[relationIdField] )
        // push the "many" element to the "shows" array of the found "one" element
        relatedItem[relationCollectionField].push( item );
        // assign the "one" element to the "show" property of the "many" element
        item[relationField] = relatedItem;
      }
    }
  }

  autoRelate( entityName: string, relations: RelationParams[] = [] ): void
  {
    const entity = this.entities[ entityName ];
    if ( !entity.data.length ) return;
    for ( let key of Object.keys( entity.data[0] ) ) {
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
  }

}