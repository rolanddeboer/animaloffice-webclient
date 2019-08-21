export interface EntityParams {
  indexKeys?: string[];
  sortKeys?: string[];
  relations?: RelationParams[];
  autoRelate?: boolean;
}

export interface RelationParams {
  entityName: string;
  sortKey?: string;
  sortReverse?: boolean;
}

export class Entity {
  private data: any[];
  private indices: Object;
  private sorts: Object;
  public owningRelations: string[];
  public inverseRelations: string[];
  private isInitializedResolve: Function;
  public isInitialized: Promise<void>;

  constructor( public name: string ) 
  { 
    this.reset();
  }

  public reset(): void
  {
    this.data = [];
    this.indices = {};
    this.sorts = {};
    this.owningRelations = [];
    this.inverseRelations = [];
    this.isInitialized = new Promise( resolve => {
      this.isInitializedResolve = resolve;
    })
  }

  setData( data: any[], params: EntityParams ): void
  {
    this.data = data;
    const indexKeys = ( "indexKeys" in params ) ? params.indexKeys : [];
    indexKeys.push( "id" );
    this.makeIndices( indexKeys );

    if ( "sortKeys" in params ) {
      this.makeSorts( params.sortKeys );
    }

    this.isInitializedResolve();
  }

  private makeIndices( indexKeys: string[] ): void
  {
    if ( !indexKeys.length ) {
      return;
    }

    // Filling the indices object with an empty object for each index.
    for ( let indexKey of indexKeys ) {
      this.indices[ indexKey ] = {};
    }

    // Generating indices
    for ( let key of Object.keys( this.data ) ) {
      for ( let indexKey of indexKeys ) {
        this.indices[ indexKey ][ this.data[key][indexKey] ] = key;
      }
    }
  }

  private makeSorts( sortKeys: string[] ): void
  {
    if ( !sortKeys.length ) {
      return;
    }

    // prepare empty array for each sort key
    for ( let sortKey of sortKeys ) {
      this.sorts[ sortKey ] = [];
    }

    // fill each sort key array with the corresponding data values
    for ( let key of Object.keys( this.data ) ) {
      for ( let sortKey of sortKeys ) {
        this.sorts[ sortKey ].push( [
          this.data[key][sortKey],
          key
        ]);
      }
    }

    // sort it
    for ( let sortKey of sortKeys ) {
      this.sorts[ sortKey ].sort( 
        (a: any, b: any) => {
          if (a[0] === b[0]) {
            return 0;
          }
          return (a[0] < b[0]) ? -1 : 1;
        }
      );
      const sortedKeys = [];
      for ( let item of this.sorts[ sortKey ] ) {
        sortedKeys.push( item[1] );
      }
      this.sorts[ sortKey ] = sortedKeys;
    }
  }

  get( sortKey: string = null, reverse = false ): any[]
  {
    if ( !sortKey) {
      return this.data
    }

    // make sure the sort has been prepared
    if ( !( sortKey in this.sorts ) ) {
      this.makeSorts( [sortKey] );
    }

    // prepare an empty array and fill it with the sorted data
    const data = [];
    if ( reverse ) {
      for ( let i = this.sorts[sortKey].length-1; i >= 0; i-- ) {
        data.push( this.data[ this.sorts[sortKey][i] ] );
      }
    } else {
      for ( let key of this.sorts[sortKey] ) {
        data.push( this.data[key] );
      }
    }

    return data;
  }

  getWhere( key: string, value: any ): any[]
  {
    if ( !this.data.length || !( key in Object.keys(this.data[0]) ) ) return [];

    const data: any = [];
    for  ( let datum of this.data ) {
      if ( datum[key] == value ) data.push( datum );
    }
    
    return data;
  }

  find( value: any, index: string = "id" ): Object
  {
    return this.data[ this.indices[ index as string ][ value ] ];
  }

  newOwningRelation( relatedEntityName: string, relatedEntityCollectionName: string )
  {
    this.owningRelations.push( relatedEntityName );
    for ( let item of this.data ) {
      item[relatedEntityCollectionName] = [];
    }
  }

  newInverseRelation( relatedEntityName: string ): void
  {
    // remove any existing relation by this name
    this.removeInverseRelation( relatedEntityName );
    // all we actually do here is store the name of the relation. Filling the data will be done by the database service, so that only one loop through the related entity is needed.
    this.inverseRelations.push( relatedEntityName );
  }

  removeOwningRelation( entityName: string ): void
  {
    const relationCollectionField = entityName[0].toLowerCase() + entityName.slice(1) + "s";
    for ( let item of this.data ) {
      item[relationCollectionField] = [];
    }
  }

  removeInverseRelation( entityName: string ): void
  {
    // Remove the related entity name from the list of inverse relations
    var index = this.inverseRelations.indexOf( entityName );
    // Not doing anything if there is no known relation by this name
    if (index === -1) return;
    this.inverseRelations.splice(index, 1);

    const relationField = entityName[0].toLowerCase() + entityName.slice(1);
    for ( let item of this.data ) {
      item[relationField] = null;
    }
  }
}