import { Injectable, LOCALE_ID, Inject, EventEmitter } from '@angular/core';
import { InitData, Show, ShowOverall } from '../../classes/initData';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { InitDataService } from './init-data.service';
import { DatabaseService } from '../database/database.service';
import { Person, BreederNumber } from 'src/app/classes/person';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public themeUpdated = new EventEmitter<string>();
  public logoutOccured = new EventEmitter<void>();
  public logoutCompleted = new EventEmitter<void>();
  public loginStatusChanged = new EventEmitter<void>();
  public burgerState = false;
  private whenInitializedResolve: Function;
  public whenInitialized: Promise<void>;
  public smallScreen: boolean;
  public activeShow: Show;
  public person: Person;
  // public initData: InitData;
  public username;
  public federations;
  public servername;
  public locale;

  private languages = {
    'en-US': {
      name: 'English',
      prefix: 'en'
    },
    'nl-NL': {
      name: 'Nederlands',
      prefix: 'nl'
    }
  }
  private backgroundNumber = String(Math.floor(Math.random() * 8));

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    }),
    withCredentials: true
  };

  constructor(
    @Inject(LOCALE_ID) public localeId: string,
    private http: HttpClient,
    private initDataService: InitDataService,
    private db: DatabaseService
  ) { 
    this.servername = environment.production ? 'https://v2.animaloffice.net' : '/server';
    this.whenInitialized = new Promise( resolve => {
      this.whenInitializedResolve = resolve;
    })
    this.initDataService.getInitData( this.getServerUriFrom() )
      .subscribe((data: InitData) => this.setInitData( data ))
    ;
    // touchscreen detection cause we don't want no tooltips on those
    (window as any).addEventListener('touchstart', function onFirstTouch() {
      document.body.classList.add('touch');
      // stop listening now
      (window as any).removeEventListener('touchstart', onFirstTouch, false);
    }, false);
    
    // set and track whether we are on a small screen
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    this.smallScreen = mediaQuery.matches;
    mediaQuery.addListener(e => {
      this.smallScreen = e.matches;
    })
  }

  setInitData( initData: InitData ): void
  {
    const showOveralls = [];
    for ( let showOverall of initData.showOveralls) {
      showOveralls.push( new ShowOverall( showOverall ) );
    }
    // this.db.set( "ShowOverall", showOveralls, { indexKeys: ["slug"] } );
    this.db.set( "ShowOverall", showOveralls, { "slug": { "index": true } } );

    const shows = [];
    for ( let show of initData.shows) {
      shows.push( new Show( show ) );
    }

    this.db.set( "ShowStatus", initData.showStatuses, { "position": { "presort": true } } );
    this.db.set( "Show", shows ); 
    this.db.set( "BreederFederation", initData.breederFederations );
    this.db.set( "Region", initData.regions, null, { autoRelate: false } );

    // this.db.add( "Show", shows, { 
    //   // relations: [
    //   //   { entityName: "ShowOverall" , sortKey: "name", sortReverse: true }
    //   // ],
    //   sortKeys: ["name"],
    //   autoRelate: true
    // } );
    // console.log( this.db.entities );
    // console.log( this.db.get( "ShowOverall" ) );
    // console.log( this.db.get( "Show") );
    // console.log( this.db.find( "ShowOverall", 1));
    // console.log( this.db.getRelated( "Show", "ShowOverall", "noordshow", "slug" ));
    // this.db.select("ShowOverall", "noordshow", "slug").getRelated("Show");
    // this.db.select("ShowOverall").selectBy("slug").select("noordshow").getRelated("Show");

    if ('person' in initData) {
      this.setLoginInitData( initData );
    } else {
      this.loginStatusChanged.emit();
    }
    this.whenInitializedResolve();
  }

  setLoginInitData( data: InitData ): void
  {
    if ("countries" in data) this.db.set( "Country", data.countries ); 
    this.db.set( "Animal", data.animals, { "position": { "presort": true } }  ); 
    this.db.set( "BreedGroup", data.breedGroups, { "position": { "presort": true } }  ); 
    this.db.set( "Breed", data.breeds, { "position": { "presort": true } } , { "filterFunctions": { "test": (item: any)  => { return item["name"]==="Muskuseend" } } } ); 
    this.db.set( "BreedColour", data.breedColours, { "position": { "presort": true } }  ); 
    this.db.setJunction( "Breed", "BreedColour", data.breedToBreedColours );
    this.setPerson( data.person );

    // console.log(this.db.get( "Breed" , "active"));
    // console.log(this.db.get( "Breed" , "test"));
  }

  letMeKnowOfLogin(): void
  {
    if (this.person) {
      this.loginStatusChanged.emit();
    }
  }

  setPerson(person: Person)
  {
    this.person = new Person( person );
    this.username = this.person.fullName;
    this.loginStatusChanged.emit();
  }

  relateManyToMany(): void {
  }

  getServerUriFrom( path: string = "" ): string
  {
    return this.servername + "/" + this.getLanguagePrefix() + "/" + path; 
  }

  getUriStartApiLocale() 
  {
    return this.servername + "/" + this.getLanguagePrefix() + "/nl/api";
  }

  getUriStartLocale() 
  {
    return this.servername + "/" + this.getLanguagePrefix();
  }

  getUriStart( location: string ): string
  {
    return this.servername + "/" + location;
  }
  
  isOperaMini() 
  {
    return (navigator.userAgent.indexOf('Opera Mini') > -1);
    // var isOperaMini = Object.prototype.toString.call(window.operamini) === "[object OperaMini]"
  }

  getBackgroundNumberWide(): string 
  {
    return this.backgroundNumber;
  }

  getBackgroundNumberSquare(): string 
  {
    return this.backgroundNumber;
  }

  getLocaleId(): string 
  {
    return this.localeId;
  }

  getLanguageName(): string 
  {
    if (this.localeId in this.languages) {
      return this.languages[this.localeId].name;
    } else {
      return this.localeId;
    }
  }

  getLanguagePrefix(): string 
  {
    if (this.localeId in this.languages) {
      return this.languages[this.localeId].prefix;
    } else {
      return this.localeId;
    }
  }

  logout(): void
  {
    this.submitLogout().subscribe(
      () => {
        this.username = null;
        this.logoutOccured.emit();
        this.loginStatusChanged.emit();
      })
    ;
  }

  completeLogout(): void
  {
    this.logoutCompleted.emit();
  }

  submitLogout(): Observable<any> 
  {
    const url = this.getServerUriFrom( "nl/logout" );
    return this.http.post<any>(url, null, this.httpOptions)
    .pipe(
      retry(3),
      catchError(error => throwError('Logout failed'))
    );
  }

}
