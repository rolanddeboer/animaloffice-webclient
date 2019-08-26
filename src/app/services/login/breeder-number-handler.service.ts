import { Injectable } from '@angular/core';
import { SettingsService } from '../config/settings.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators';
import { BreederFederation } from 'src/app/classes/initData';
import { DatabaseService } from '../database/database.service';

interface BreederNumberType {
  breederNumber: string;
  federation: BreederFederation;
  editMode?: boolean;
}

class PersonType {
  postcode = "";
  password = "";

  constructor( public name = "", public username = "") { }
}

// class BnReturnType {
//   person: PersonType;
//   breederNumber: BreederNumberType;
//   addNumber = false;
//   loggedIn = false;
// }

interface BnReturn {
  federation_id: number;
  breederNumber: string;
  status: string;
  name: string;
  person?: Object;
  countries?: Object[];
}

@Injectable({
  providedIn: 'root'
})
export class BreederNumberHandlerService {
  public postcodes: string[] = [];
  public password = "";
  public persist = false;
  private breederNumber: BreederNumberType;
  private observer: any;

  constructor(
    private settings: SettingsService,
    private db: DatabaseService,
    private http: HttpClient
  ) { }

  login( params: {password: string, breederNumber: string, federation_id: number} ): Promise<any>
  {
    let resolvePromise: Function;
    let rejectPromise: Function;

    const url = this.settings.getServerUriFrom( "nl/login" );

    const promise = new Promise( 
      (resolve, reject) =>
      {
        resolvePromise = resolve;
        rejectPromise = reject;
      }
    );

    this.http.post<any>( url, params, this.settings.httpOptions )
    .pipe(
      catchError(error => {
        console.log( error.status );
        if ( error.status == 403) {
          resolvePromise( null );
        } else {
          rejectPromise("Something went wrong. Try reloading the page.");
        }
        return throwError("");
      })
    )
    .subscribe(
      (data) => {
        resolvePromise( data );
      }
    )

    return promise;
  }

  checkPerson( breederNumber: BreederNumberType, postcodes: string[] )
  {
    let resolvePromise: Function;
    let rejectPromise: Function;

    const url = this.settings.getServerUriFrom( "nl/security/check-breeder-number/person" );
    
    const data = {
      federation_id: breederNumber.federation.id,
      breederNumber: breederNumber.breederNumber,
      postcodes: postcodes,
      withCountries: !this.db.has("Country")
    }

    const promise = new Promise( 
      (resolve, reject) =>
      {
        resolvePromise = resolve;
        rejectPromise = reject;
      }
    );

    this.http.post<any>( url, data, this.settings.httpOptions )
    .pipe(
      retry(3),
      catchError(error => {
        rejectPromise("Something went wrong. Try reloading the page.");
        return throwError("");
      })
    )
    .subscribe(
      (data) => {
        resolvePromise( data );
      }
    )

    return promise;

  }

  // check( breederNumber: BreederNumberType ): Observable<any>
  // {
  //   this.breederNumber = breederNumber;
  //   const url = "nl/security/check-breeder-number/person";

  //   return this.submit(
  //     this.compileData( ),
  //     this.settings.getServerUriFrom( url )
  //   );
  // }

  // submit( data: Object, url: string ): Observable<any>
  // {
  //   const options = this.settings.httpOptions;

  //   const bnObservable = new Observable( observer => {  
  //     this.observer = observer;
  //   });

  //   console.log( "posting to url", url );
  //   console.log( "posting data", JSON.stringify(data) );

  //   this.http.post<any>( url, data, options )
  //   .pipe(
  //     retry(3),
  //     catchError(error => this.handleError(error))
  //   )
  //   .subscribe(
  //     (data: any) => {
  //       this.formSubmitted(data);
  //     }
  //   )

  //   return bnObservable;
  // }

  // compileData() {
  //   return {
  //     federation_id: this.breederNumber.federation.id,
  //     breederNumber: this.breederNumber.breederNumber.trim(),
  //     postcodes: this.postcodes,
  //     password: this.password
  //   }
  //   // return {
  //   //   federation_id: this.breederNumber.federation.id,
  //   //   number: this.breederNumber.breederNumber.trim(),
  //   //   postcodes: this.postcodes,
  //   //   password: this.password,
  //   //   person_id: 0,
  //   //   isAdmin: 0,
  //   //   isOther: 0,
  //   //   isAnonymous: 1,
  //   //   force: 0,
  //   //   sudo: 0,
  //   //   show_slug: '',
  //   //   forLogin: this.persist ? 0 : 1
  //   // }
  // }

  // private handleError(error: HttpErrorResponse) {
  //   const errorMessage = 'Something went wrong. Try reloading the page.';
  //   console.error( "server error response", error );
  //   this.observer.error( errorMessage );
  //   // return an observable with a user-facing error message
  //   return throwError(
  //     'Something went wrong.');
  // };

  // formSubmitted(data: BnReturn): void {
  //   console.log( "succesful server response:", data );
  //   this.observer.next( data );

  //   // const returnObject = new BnReturnType();
  //   // if ( data.name ) {
  //   //   returnObject.person = new PersonType(data.name, data.username);
  //   // } else if (data.userLogin) {
  //   //   this.settings.setUsername(data.userLogin);
  //   //   returnObject.loggedIn = true;
  //   // } else {
  //   //   this.breederNumber.federation = this.db.find( "BreederFederation", data.federation_id ); 
  //   //   this.breederNumber.breederNumber = data.breederNumber;
  //   //   returnObject.addNumber = true;
  //   // }
  //   // returnObject.breederNumber = this.breederNumber;

  //   // this.observer.next( returnObject );
  // }
}
