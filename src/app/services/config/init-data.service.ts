import { Injectable } from '@angular/core';
import { SettingsService } from '../config/settings.service';
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
    private http: HttpClient) { }

  getInitData(): Observable<InitData>
  {
    let initData = (window as any).init_data;
    if ( initData ) {
      return of( initData );
    } else {
      return this.http.get<InitData>( "/server/nl/initdata.json" );
    }

    // if (!initData) {
    //   initData = new InitData( defaultData );
    // }
    // return of(initData);
  }
}
