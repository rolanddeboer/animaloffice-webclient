export interface Field {
  index?: boolean;
  presort?: boolean;
  sortFunction?: Function;
}

export interface EntityParams {
  indexKeys?: string[];
  sortKeys?: string[];
  relations?: RelationParams[];
  filterFunctions?: { [key:string]: Function };
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
  private sets: Object;
  private sortFunctions: { [key:string]: Function };
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
    // Indices allow retrieving an object by the value of an indexed key, through the "find" method.
    this.indices = {}; 
    this.sets = { };
    this.owningRelations = [];
    this.inverseRelations = [];

    // define the sort functions
    this.sortFunctions = {
      "_default": (a: any, b: any) => {
        if (a[0] === b[0]) {
          return 0;
        }
        return (a[0] < b[0]) ? -1 : 1;
      },
      "_string": (a: string, b: string) => {
        return ('' + a[0]).localeCompare(b[0], "nl_NL");
      }
    };

    this.isInitialized = new Promise( resolve => {
      this.isInitializedResolve = resolve;
    })
  }

  setData( data: any[], fields: { [key:string]: Field }, params: EntityParams ): void
  {
    this.data = data;

    const indexKeys = ( "indexKeys" in params ) ? params.indexKeys : [];
    indexKeys.push( "id" );
    const sortKeys = ( "sortKeys" in params ) ? params.sortKeys : [];
    const filterFunctions = ( "filterFunctions" in params ) ? params.filterFunctions : {};

    if ( fields ) {
      for ( let fieldName of Object.keys(fields) ) {
        if ( 
          fieldName !== "id" && 
          "index" in fields[fieldName] && 
          fields[fieldName].index 
        ) {
          indexKeys.push( fieldName );
        }
        if ( "presort" in fields[fieldName] && fields[fieldName].presort ) {
          sortKeys.push( fieldName );
        }
        if ( "sortFunction" in fields[fieldName] && fields[fieldName].sortFunction ) {
          this.sortFunctions[ fieldName ] = fields[fieldName].sortFunction;
        }
      }
    }

    this.makeIndices( indexKeys );
    this.makeFilters( filterFunctions );
    this.makeSorts( sortKeys );
    this.isInitializedResolve();
  }

  private makeFilters( filterFunctions: { [key:string]: Function } ): void
  {
    this.sets["all"] = {};
    this.sets["all"]["_default"] = Object.keys( this.data );

    // find out whether there is a field to mark deletion
    let firstItem = this.data.find( x => x !== undefined );
    const deletedWords = [ "isBackup", "deleted", "isDeleted", "removed", "isRemoved" ];
    let deletedField: string;
    for ( let deletedWord of deletedWords ) {
      if ( firstItem && deletedWord in firstItem ) {
        deletedField = deletedWord;
      }
    }
    // prepare a filter function for deleted items
    if ( deletedField ) {
      this.sets["active"] = {};
      filterFunctions["active"] = ( item: any ) => {
        return item[ deletedField ] == false;
      }
    }

    // prepare a list of keys for every filter
    if ( filterFunctions !== {} ) {
      for ( let filter of Object.keys( filterFunctions ) ) {
        this.sets[ filter ] = { "_default": [] };
        for ( let key of this.sets["all"]["_default"] ) {
          if ( filterFunctions[ filter ]( this.data[key] ) ) {
            this.sets[ filter ]["_default"].push( key );
          }
        }
      }
    }
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

    for ( let filter of Object.keys( this.sets ) ) {

      // prepare empty array for each sort key
      for ( let sortKey of sortKeys ) {
        this.sets[ filter ][ sortKey ] = [];
      }

      // fill each sort key array with the corresponding data values
      for ( let key of this.sets[ filter ]["_default"] ) {
        for ( let sortKey of sortKeys ) {
          this.sets[ filter ][ sortKey ].push( [
            this.data[key][sortKey],
            key
          ]);
        }
      }

      // sort it
      for ( let sortKey of sortKeys ) {
        let sortFunction = this.sortFunctions["_default"];
        if ( sortKey in this.sortFunctions ) {
          sortFunction = this.sortFunctions[sortKey];
        } else if ( typeof this.sets[ filter ][ sortKey ][0] === "string" ) {
          sortFunction = this.sortFunctions["_string"]
        }
        this.sets[ filter ][ sortKey ].sort( sortFunction );
        const sortedKeys = [];
        for ( let item of this.sets[ filter ][ sortKey ] ) {
          sortedKeys.push( item[1] );
        }
        this.sets[ filter ][ sortKey ] = sortedKeys;
      }
    }
  }

  get( filter = "all", sortKey = "_default", reverse = false ): any[]
  {
    if ( sortKey === "_default" && filter === "all" ) {
      return this.data;
    }

    // make sure the sort has been prepared
    if ( sortKey !== "_default"  && !( sortKey in this.sets[ filter ] ) ) {
      this.makeSorts( [sortKey] );
    }

    // prepare an empty array and fill it with the sorted data
    const data = [];
    if ( reverse ) {
      for ( let i = this.sets[ filter ][sortKey].length-1; i >= 0; i-- ) {
        data.push( this.data[ this.sets[ filter ][sortKey][i] ] );
      }
    } else {
      for ( let key of this.sets[ filter ][sortKey] ) {
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