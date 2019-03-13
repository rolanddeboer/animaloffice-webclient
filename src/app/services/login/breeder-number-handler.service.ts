import { Injectable } from '@angular/core';
import { SettingsService } from '../config/settings.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators';


class BreederNumberType {
  breederNumber: string;
  associationId: number;
  associationName?: string;
  editMode?: boolean;
}
class PersonType {
  name: string;
  username: string;
  postcode: string;
  password: string;

  constructor(name = '', username = '') {
    this.name = name;
    this.username = username;
    this.postcode = '';
    this.password = '';
  }
}
class BnReturnType {
  person: PersonType;
  breederNumber: BreederNumberType;
  addNumber = false;
  loggedIn = false;
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
    private settingsService: SettingsService,
    private http: HttpClient
  ) { }

  submit( breederNumber: BreederNumberType ): Observable<any>
  {
    this.breederNumber = breederNumber;

    const bnObservable = new Observable( observer => {  
      this.observer = observer;
    });

    const url = this.settingsService.getUriStartApiLocale() + "/login/submit/breeder-number";
    const data = this.compileData( );
    const options = this.settingsService.httpOptions;

    console.log( "posting to url", url );
    console.log( "posting data", JSON.stringify(data) );

    this.http.post<any>( url, data, options )
    .pipe(
      retry(3),
      catchError(error => this.handleError(error))
    )
    .subscribe(
      (data: any) => {
        this.formSubmitted(data);
      }
    )

    return bnObservable;
  }

  compileData() {
    return {
      association_id: this.breederNumber.associationId,
      number: this.breederNumber.breederNumber.trim(),
      postcodes: this.postcodes,
      password: this.password,
      person_id: 0,
      isAdmin: 0,
      isOther: 0,
      isAnonymous: 1,
      force: 0,
      sudo: 0,
      show_slug: '',
      forLogin: this.persist ? 0 : 1
    }
  }

  private handleError(error: HttpErrorResponse) {
    const errorMessage = 'Something went wrong. Try reloading the page.';
    console.error( "server error response", error );
    // if (error.error instanceof ErrorEvent) {
    //   // A client-side or network error occurred. Handle it accordingly.
    //   console.error('An error occurred:', error.error.message);
    // } else {
    //   console.error(error.message);
    //   if (typeof error.error === 'object' && 'message' in error.error) {
    //     console.error('Server responded:', error.error['message']);
    //   } else {
    //     console.error('Server gave no extra details.');
    //   }
    // }
    this.observer.error( errorMessage );
    // return an observable with a user-facing error message
    return throwError(
      'Something went wrong.');
  };

  formSubmitted(data: any): void {
    console.log( "succesful server response:", data );
    if (!('status' in data) || typeof data.status !== 'string') {
      this.observer.error( "Something went wrong. Please try again in 5 minutes." );
      return;
    }
    if (data.status === 'error') {
      this.observer.error( data.message );
      return;
    }
    const returnObject = new BnReturnType();
    if ( data.name ) {
      returnObject.person = new PersonType(data.name, data.username);
    } else if (data.userLogin) {
      this.settingsService.setUsername(data.userLogin);
      returnObject.loggedIn = true;
    } else {
      this.breederNumber.associationId = data.association_id; 
      this.breederNumber.breederNumber = data.breederNumber;
      returnObject.addNumber = true;
    }
    returnObject.breederNumber = this.breederNumber;

    this.observer.next( returnObject );
  }
}
