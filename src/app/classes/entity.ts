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
  indices = {};
  sorts = {};

  constructor( 
    public name: string, 
    public data: Object[], 
    params: EntityParams
  ) 
  { 
    const indexKeys = ( "indexKeys" in params ) ? params.indexKeys : [];
    indexKeys.push( "id" );
    this.makeIndices( indexKeys );

    if ( "sortKeys" in params ) {
      this.makeSorts( params.sortKeys );
    }
  }

  makeIndices( indexKeys: string[] ): void
  {
    if ( !indexKeys.length ) {
      return;
    }

    // Filling the indices object with an empty array for each index.
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

  makeSorts( sortKeys: string[] ): void
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

  get( sortKey: string = null, reverse = false ): Object[]
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

  find( value: any, index: string = "id" ): Object
  {
    return this.data[ this.indices[ index as string ][ value ] ];
  }

  newRelation( relatedEntityName: string, relatedEntityCollectionName: string )
  {
    for ( let item of this.data ) {
      item[relatedEntityCollectionName] = [];
    }
  }

}