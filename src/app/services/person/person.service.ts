import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators';

import { SettingsService } from '../config/settings.service';

import { Person } from 'src/app/classes/person';

@Injectable({
  providedIn: 'root'
})
export class PersonService 
{
  private getDetailsObserver: any;
  private savePersonObserver: any;

  constructor(
    private settingsService: SettingsService,
    private http: HttpClient
  ) { }

  getDetails(): Observable<Object>
  {
    const url = this.settingsService.getUriStartApiLocale() + "/profile/details.json";
    const options = this.settingsService.httpOptions;

    this.http.get<any>( url, options )
    .pipe(
      retry(3),
      catchError(error => this.handleError(error, this.getDetailsObserver))
    )
    .subscribe(
      (data: any) => {
        this.detailsReceived(data);
      }
    )
    return new Observable( observer => this.getDetailsObserver = observer );
  }

  detailsReceived(data: Object): void 
  {
    if ( 'person' in data && 'countries' in data ) {
      this.getDetailsObserver.next( data );
    } else {
      this.getDetailsObserver.error( "Something went wrong. Please try again in 5 minutes." );
    }
  }

  savePerson( person: Person): Observable<any>
  {
    const url = this.settingsService.getUriStartApiLocale() + "/profile/update";
    console.log(url, JSON.stringify(person));
    const options = this.settingsService.httpOptions;

    this.http.post<any>( url, person, options )
    .pipe(
      retry(3),
      catchError(error => this.handleError(error, this.savePersonObserver))
    )
    .subscribe(
      (data: any) => {
        this.personSaved(data);
      }
    )
    return new Observable( observer => this.savePersonObserver = observer );
  }

  personSaved(data: Object): void 
  {
    console.log(data);
    if ( 'validation' in data ) {
      this.savePersonObserver.next( data["validation"] );
    } else {
      this.savePersonObserver.error( "Something went wrong. Please try again in 5 minutes." );
    }
  }

  createProfile( person: Person, postcodes: Array<string> ): Promise<any>
  {
    const promiseFunctions = {
      resolvePromise: Function,
      rejectPromise: Function
    }
    const promise = this.settingsService.createEmptyPromise( promiseFunctions );

    const url = this.settingsService.getServerUriFrom( "nl/security/create-profile" );
    const params = { person: person, postcodes: postcodes };

    this.http.post<any>( url, params, this.settingsService.httpOptions )
    .pipe(
      retry(3),
      catchError(error => {
        promiseFunctions.rejectPromise( this.settingsService.delicateErrorMessage );
        return throwError("");
      })
    )
    .subscribe(
      (data) => {
        promiseFunctions.resolvePromise( data );
      }
    )

    return promise;
  }

  private handleError(error: HttpErrorResponse, observer: any): Observable<string> 
  {
    const errorMessage = "Something went wrong. Try reloading the page.";
    // console.error( "server error response", error );
    observer.error( errorMessage );
    // must return an observable
    return throwError( "Something went wrong.");
  };

}