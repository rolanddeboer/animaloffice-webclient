import { Injectable } from '@angular/core';
import { InitData } from '../../classes/initData';
import defaultData from '../../misc/default-data.json';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs'
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InitDataService {

  constructor(
    private http: HttpClient
  ) { }

  getInitData( serverUri: string ): Observable<InitData>
  {
    let initData = (window as any).init_data;
    if ( initData ) {
      return of( initData );
    } else {
      return this.http.get<InitData>( serverUri + "initdata.json" );
    }

    // if (!initData) {
    //   initData = new InitData( defaultData );
    // }
    // return of(initData);
  }
}
