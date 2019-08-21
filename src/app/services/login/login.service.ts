import { Injectable, ElementRef } from '@angular/core';
import { SpinnerService } from '../spinner/spinner.service';
import { RoutingToolsService } from '../config/routing-tools.service';
import { SettingsService } from '../config/settings.service';
import { BreederNumberHandlerService } from './breeder-number-handler.service';
import { BreederFederation } from 'src/app/classes/initData';
import { DatabaseService } from '../database/database.service';
import { Person, BreederNumber } from 'src/app/classes/person';

class BreederNumberType {
  breederNumber = "";
  federation: BreederFederation;
  editMode?: boolean;
  persisted = false;
}

class PersonEntryData {
  postcode = "";
  password = "";

  constructor( public name = "", public hasUser = false ) { }
}

// interface PersonEntryData {
//   name: string;
//   postcode?: string;
//   password?: string;
//   hasUser?: boolean;
// }

interface BnReturn {
  federation_id: number;
  breederNumber: string;
  status: string;
  name: string;
  person?: Object;
  countries?: Object[];
}

enum BnStatus {
  INVALID = "invalid",
  IS_FREE = "isFree",
  HAS_PERSON = "hasPerson",
  HAS_USER = "hasUser",
  PERSON_AUTHORIZED = "personAuthorized",
  NOT_AUTHORIZED = "notAuthorized"
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public breederNumbers: BreederNumberType[] = [];
  public persistingBreederNumbers: BreederNumberType[] = [];
  public currentlyPersistingId: number;
  public editingNumber: BreederNumberType;
  public person: PersonEntryData;
  public forLogin = true;
  public errorMessage: string;
  public loading = false;
  public notMe = false;
  public breederNumberInputRef: ElementRef;
  public associationInputRef: ElementRef;
  public passwordInputRef: ElementRef;
  public persistingAll = false;
  public postcodes: string[] = [];
  private spinnerCounter = 0;
  public inModal = false;


  constructor(
    private spinner: SpinnerService,
    private routingTools: RoutingToolsService,
    private db: DatabaseService,
    private settingsService: SettingsService,
    private bnHandler: BreederNumberHandlerService
  ) { 
    this.db.when( "BreederFederation" ).then( () => this.start() );
  }

  start(): void 
  {
    if (!this.breederNumbers.length) {
      this.addNumber();
    }
  }

  reset(): void 
  {
    this.updateActiveBreederNumber(true);
    this.person = null;
    this.start();
  }

  getFreeAssociations(): BreederFederation[]
  {
    const federations: BreederFederation[] = [];
    for ( let federation of this.db.get("BreederFederation") ) {
      let free = true;
      for (let bn of this.breederNumbers) {
        if (bn.federation.id === federation.id && !bn.editMode) {
          free = false;
        }
      }
      if (free) {
        federations.push(federation);
      }
    }
    return federations;
  }

  addNumber(): void
  {
    const newBn = new BreederNumberType;
    newBn.federation = this.getFreeAssociations()[0];
    this.breederNumbers.push( newBn );
    // edit the last breeder number, which is the one we just added
    this.editNumber( this.breederNumbers.length - 1 );
  }

  editNumber( id: number ): void 
  {
    // roll back any current changes
    this.revertEditingBreederNumber();
    // shallow clone the object so that changes to the form will not have immediate effect on the breeder number that is still in the list. We only want the changes to go into effect when the server has confirmed the breeder number.
    this.editingNumber = { ...this.breederNumbers[id] };
    this.breederNumbers[id].editMode = true;
    // focus bn input. It might not be there yet if the input component was not opened before. In that case the input component will focus its bn input itself, so not to worry.
    if (this.breederNumberInputRef) {
      this.breederNumberInputRef.nativeElement.focus();
    }
  }
  
  deleteNumber(id: number): void 
  {
    // roll back any current changes
    this.revertEditingBreederNumber();
    this.breederNumbers.splice(id, 1);
    if (!this.breederNumbers.length) {
      this.addNumber();
    }
  }

  notMeClicked(): void
  {
    this.errorMessage = "";
    this.notMe = true;
  }

  notMeEditAgain(): void
  {
    this.person = null;
    this.notMe = false;
    setTimeout(() => this.breederNumberInputRef.nativeElement.focus(), 100);
  }

  confirmName(): void 
  {
    if ( this.person.hasUser ) {
      this.login();
      return;
    }
    if ( this.person.postcode ) {
      this.bnHandler.postcodes.push(this.person.postcode);
      this.postcodes.push(this.person.postcode);
    }
    if ( this.person.password ) {
      this.bnHandler.password = this.person.password;
    }
    this.submit();
  }

  login(): void
  {
    this.startSpinner();
    this.bnHandler.login( {
      password: this.person.password,
      breederNumber: this.editingNumber.breederNumber,
      federation_id: this.editingNumber.federation.id
    } )
    .then(
      (data: any) => {
        this.stopSpinner();
        if (data) {
          // this.reset();
          // this.routingTools.navigateToRoute('home');
        } else {
          this.passwordInputRef.nativeElement.focus();
          this.errorMessage = "Het wachtwoord klopt niet.";
        }
      }
    )
    .catch(
      (error: string) =>  {
        this.stopSpinner();
        this.passwordInputRef.nativeElement.focus();
        this.errorMessage = error;
      }
    );

  }

  saveAll(): void
  {
    this.db.set( "BreederNumbers", this.breederNumbers );
    let person = new Person();
    for ( let breederNumber of this.breederNumbers ) {
      let newBn = new BreederNumber;
      newBn.association_id = breederNumber.federation.id;
      newBn.association_name = breederNumber.federation.name;
      newBn.breederNumber = breederNumber.breederNumber;
      person.breederNumbers.push( newBn );
    }
    this.settingsService.person = person;
    console.log(person);
    this.routingTools.navigateToRoute( "person" );
    // this.persistingAll = true;
    // this.persistNext();
  }

  // persistNext(): void
  // {
  //   let foundOne = false;
  //   for ( let id = 0; id < this.breederNumbers.length; id ++ ) {
  //     if ( !this.persistingAll ) break;
  //     if ( !this.breederNumbers[id].persisted ) {
  //       foundOne = true;
  //       this.breederNumbers[id].persisted = true;
  //       this.editNumber( id );
  //       this.submit();
  //       break;
  //     }
  //   }
  //   if ( !foundOne ) {
  //     this.persistingAll = false;
  //     alert( "Welcome!" );
  //   }
  // }

  // check(): void
  // {
  //   if ( !this.validateForm ) return;
  //   this.startSpinner();
  //   this.bnHandler.checkPerson(
  //     this.editNumber,
  //     this.
  //   )
  // }

  submit(): void
  {
    if ( !this.validateForm ) return;
    this.startSpinner();
    this.bnHandler.checkPerson( this.editingNumber, this.postcodes )
      .then((data: any) => {
        this.stopSpinner();
        this.submitHasJustComeBackAndGuessWhat( data );
      })
      .catch((error: string) => {
        this.errorMessage = error;
        this.stopSpinner();
        this.breederNumberInputRef.nativeElement.focus();
      })
    ;
  }
  // submit1(): void
  // {
  //   if ( !this.validateForm ) return;
    
  //   // const data = this.compileData();
  //   // console.log(JSON.stringify(data));
  //   this.startSpinner();
  //   const that = this;
  //   this.bnHandler.persist = this.persistingAll;
  //   this.bnHandler
  //     .check( this.editingNumber )
  //     .subscribe( {
  //       next(data) { 
  //         // console.log(data);
  //         that.stopSpinner();
  //         that.submitHasJustComeBackAndGuessWhat( data );
  //       },
  //       error(error) { 
  //         if ( that.persistingAll ) {
  //           that.persistingAll = false;
  //         }
  //         that.errorMessage = error;
  //         that.stopSpinner();
  //         that.breederNumberInputRef.nativeElement.focus();
  //       }
  //     } )
  //   ;
  // }

  submitHasJustComeBackAndGuessWhat( data: BnReturn ): void
  {
    if ( data.status == BnStatus.PERSON_AUTHORIZED ) {
      this.reset();
      this.routingTools.navigateToRoute('home');
      return;
    }

    if ( data.status == BnStatus.HAS_PERSON || data.status == BnStatus.HAS_USER ) {
      this.person = new PersonEntryData( data.name );
    }
    if ( data.status == BnStatus.HAS_USER ) {
      this.person.hasUser = true;
    }
    if ( data.status == BnStatus.IS_FREE ) {
      this.editingNumber.breederNumber = data.breederNumber;
      this.updateActiveBreederNumber();
      if ( data.countries ) this.db.set( "Country", data.countries );
    }
    if ( data.status == BnStatus.INVALID ) {
      this.errorMessage = "Dit is niet een geldig fokkersnummer. Graag aanpassen.";
    }
    if ( data.status == BnStatus.NOT_AUTHORIZED ) {
      this.passwordInputRef.nativeElement.focus();
      this.errorMessage = "Het wachtwoord klopt niet.";
    }

    // if ( data.person ) {
    //   that.person = data.person;
    // }
    // if ( data.loggedIn ) {
    //   that.reset();
    //   that.routingTools.navigateToRoute('home');
    // }
    // if ( data.addNumber ) {
    //   if ( that.persistingAll ) {
    //     that.editingNumber.persisted = true;
    //   }
    //   that.editingNumber = data.breederNumber;
    //   that.updateActiveBreederNumber();
    // }
    // if ( that.persistingAll ) {
    //   that.persistNext();
    // }
  }

  revertEditingBreederNumber(): void
  {
    this.updateActiveBreederNumber(true);
  }

  updateActiveBreederNumber(revert = false): void
  {
    // set revert to true if the purpose is to ignore the current changes
    // using some instead of map so that we can break out after the first match.
    this.breederNumbers.some(
      (bn: BreederNumberType, index:number) => {
        if (bn.editMode) {
          this.editingNumber.editMode = false;
          if (!revert) {
            this.breederNumbers[index] = { ...this.editingNumber };
          } else if (!bn.breederNumber) {
            this.breederNumbers.splice(index, 1);
          }
          this.editingNumber = null;
          return true;
        }
      }
    );
  }

  startSpinner(): void 
  {
    this.errorMessage = "";
    this.spinnerCounter ++;
    this.loading = true;
  }

  stopSpinner(): void
  {
    this.spinnerCounter --;
    if ( this.spinnerCounter == 0 ) {
      this.loading = false;
    }
  }

  validateForm(): boolean
  {
    if (!this.editingNumber.breederNumber.trim()) {
      this.errorMessage = "Please fill in the breeder number in the field above.";
      this.breederNumberInputRef.nativeElement.focus();
      return false;
    }
    if (!this.editingNumber.federation) {
      this.errorMessage = "Please select a federation in the field above.";
      this.associationInputRef.nativeElement.focus();
      return false;
    }
    this.errorMessage = "";
    return true;
  }

  doWeShowLoginList(): boolean
  {
    if (!this.breederNumbers) return false;
    if (this.person) return false;
    if (this.breederNumbers.length > 1) return true;
    return !(this.editingNumber);
  }
}
