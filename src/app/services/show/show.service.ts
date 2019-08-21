import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs'
import { catchError, retry } from 'rxjs/operators';

import { SettingsService } from '../config/settings.service';

@Injectable({
  providedIn: 'root'
})
export class ShowService {
  public showObserver: any;
  private showObservable: any;
  public show: any;
  private showOverallSlug: string;
  private showEditionSlug: string;

  constructor(
    private settingsService: SettingsService,
    private http: HttpClient
  ) { 
    this.showObservable = new Observable( observer => this.showObserver = observer );
  }

  // private getStartUri(): string
  // {
  //   return (
  //     this.settingsService.getUriStartLocale() 
  //     + "/" + this.showOverallSlug 
  //     + "/" + this.showEditionSlug
  //   );
  // }

  // setShow( params: Object ): void
  // {
  //   this.showOverallSlug = params["showOverallSlug"];
  //   this.showEditionSlug = params["showEditionSlug"];

  //   const url = this.getStartUri() + "/details.json";
  //   const options = this.settingsService.httpOptions;

  //   this.http.get<any>( url, options )
  //   .pipe(
  //     retry(3),
  //     catchError(
  //       error => {
  //         console.error( error )
  //         return throwError( "Something went wrong.");
  //       }
  //     )
  //   )
  //   .subscribe(
  //     data => {
  //       this.show = data["show"];
  //       this.showObserver.next( this.show );
  //     }
  //   );
  // }

  // getShow(): Observable<any>
  // {
  //   if ( this.show ) {
  //     return of( this.show );
  //   } else {
  //     return this.showObservable;
  //   }
  // }

}