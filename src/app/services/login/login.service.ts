import { Injectable, ElementRef } from '@angular/core';
import { SpinnerService } from '../spinner/spinner.service';
import { RoutingToolsService } from '../config/routing-tools.service';
import { SettingsService } from '../config/settings.service';
import { BreederNumberHandlerService } from './breeder-number-handler.service';
import { BreederFederation } from 'src/app/classes/initData';
import { DatabaseService } from '../database/database.service';
import { Person, BreederNumber } from 'src/app/classes/person';

export class BreederNumberType {
  breederNumber = "";
  federation_id: number;
  editMode?: boolean;
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
  person?: Person;
  countries?: Object[];
}

enum BnStatus {
  INVALID = "invalid",
  IS_FREE = "isFree",
  HAS_PERSON = "hasPerson",
  NEW_PERSON = "newPerson",
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
  public freeFederations: BreederFederation[] = [];
  public currentlyPersistingId: number;
  public editingNumber: BreederNumberType;
  // if this.potentialPerson is set this means that a person or user was found and we are waiting for a password or postcode from the user. Whenever this.potentialPerson is set, the postcode/password input is shown.
  public potentialPerson: PersonEntryData;
  public forLogin = true;
  public errorMessage: string;
  public loading = false;
  public breederNumberInputRef: ElementRef;
  public federationInputRef: ElementRef;
  public passwordInputRef: ElementRef;
  public postcodeInputRef: ElementRef;
  public persistingAll = false;
  public postcodes: string[] = [];
  private spinnerCounter = 0;
  public inModal = false;
  // signals whether the modal should be opened when on the personal details page
  public modalOpen = false;


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
    this.setFreeFederations();
    if (!this.breederNumbers.length) {
      this.addNumber();
    }
  }

  reset(): void 
  {
    this.modalOpen = false;
    this.updateActiveBreederNumber(true);
    this.breederNumbers = [];
    this.potentialPerson = null;
    this.start();
  }

  setFreeFederations(): void
  {
    const federations: BreederFederation[] = [];
    for ( let federation of this.db.get("BreederFederation") ) {
      let free = true;
      for (let bn of this.breederNumbers) {
        if (bn.federation_id == federation.id && !bn.editMode) {
          free = false;
        }
      }
      if (free) {
        federations.push(federation);
      }
    }
    this.freeFederations = federations;
  }

  getFederationById( id: number ): BreederFederation
  {
    return this.db.find("BreederFederation", id);
  }

  setBreederNumbers( breederNumbers: BreederNumberType[] ): void
  {
    this.breederNumbers = breederNumbers;
    this.editingNumber = null;
    this.setFreeFederations();
  }

  addNumber(): void
  {
    this.setFreeFederations();
    const newBn = new BreederNumberType;
    newBn.federation_id = this.freeFederations[0].id;
    this.breederNumbers.push( newBn );
    // edit the last breeder number, which is the one we just added
    this.editNumber( this.breederNumbers.length - 1 );
  }

  editNumberByFederationId( federation_id: number ): void
  {
    this.breederNumbers.some(
      (bn: BreederNumberType, index: number) => {
        if ( bn.federation_id == federation_id ) {
          this.editNumber( index );
          return true;
        }
      }
    );
  }

  editNumber( id: number ): void 
  {
    // roll back any current changes
    this.revertEditingBreederNumber();
    // shallow clone the object so that changes to the form will not have immediate effect on the breeder number that is still in the list. We only want the changes to go into effect when the server has confirmed the breeder number.
    this.editingNumber = { ...this.breederNumbers[id] };
    this.setEditMode( this.breederNumbers[id], true );
    // focus bn input. It might not be there yet if the input component was not opened before. In that case the input component will focus its bn input itself, so not to worry.
    if (this.breederNumberInputRef) {
      this.breederNumberInputRef.nativeElement.focus();
    }
  }

  setEditMode( breederNumber: BreederNumberType, value: boolean ): void
  {
    breederNumber.editMode = value;
    this.setFreeFederations();
  }

  cancelEditing(): void
  {
    // for ( let breederNumber of this.breederNumbers ) {
    //   breederNumber.editMode = false;
    // }
    // this.setFreeFederations();
    // this.editingNumber = null;
    this.potentialPerson = null;
    this.revertEditingBreederNumber();
    if (!this.breederNumbers.length) {
      this.addNumber();
    }
  }
  
  deleteNumber(id: number): void 
  {
    // roll back any current changes
    // this.breederNumbers.some(
    //   (bn: BreederNumberType, index:number) => {
    //     if (bn.editMode) {
    //       if (index == id) {
    //         this.revertEditingBreederNumber();
    //       }
    //       return true;
    //     }
    //   }
    // );
    // this.revertEditingBreederNumber();
    // this.updateActiveBreederNumber();
    this.breederNumbers.splice(id, 1);
    if (!this.breederNumbers.length) {
      this.addNumber();
    }
    this.setFreeFederations();
  }

  dismissNameChecker(): void
  {
    this.potentialPerson = null;
  }

  confirmName(): void 
  {
    if ( this.potentialPerson.hasUser ) {
      this.login();
      return;
    }
    if ( this.potentialPerson.postcode ) {
      this.postcodes.push(this.potentialPerson.postcode);
    }
    this.checkNumber();
  }

  login(): void
  {
    this.startSpinner();
    this.bnHandler.login( {
      password: this.potentialPerson.password,
      breederNumber: this.editingNumber.breederNumber,
      federation_id: this.editingNumber.federation_id
    } )
    .then(
      (data: any) => {
        this.stopSpinner();
        this.potentialPerson.password = null;
        if (data) {
          this.settingsService.setLoginInitData( data );
          this.reset();
          this.routingTools.navigateToRoute('home');
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

  // saveAll(): void
  // {
    // if ( !this.validateForm ) return;
    // this.startSpinner();
    // this.bnHandler.saveAll( this.breederNumbers )
    //   .then((data: any) => {
    //     this.stopSpinner();
    //     console.log( data );
    //   })
    //   .catch((error: string) => {
    //     this.errorMessage = error;
    //     console.log( error );
    //     this.stopSpinner();
    //   })
    // ;

    // this.db.set( "BreederNumbers", this.breederNumbers );
    // let person = new Person();
    // for ( let breederNumber of this.breederNumbers ) {
    //   let newBn = new BreederNumber;
    //   newBn.federation_id = breederNumber.federation.id;
    //   newBn.breederNumber = breederNumber.breederNumber;
    //   person.breederNumbers.push( newBn );
    // }
    // this.settingsService.person = person;
    // this.routingTools.navigateToRoute( "person" );
    // this.persistingAll = true;
    // this.persistNext();
  // }

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

  checkNumber(): void
  {
    if ( !this.validateForm ) return;
    this.startSpinner();
    this.bnHandler.postcodes = this.postcodes;
    this.bnHandler.checkPerson( this.editingNumber, !this.inModal )
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

  goToPersonPage( modalOpen = false ): void
  {
    if ( !this.settingsService.person ) {
      this.settingsService.setPerson();
    }
    this.settingsService.person.breederNumbers = this.breederNumbers;
    this.reset();
    this.modalOpen = modalOpen;
    this.routingTools.navigateToRoute('person');
  }

  // set the person except if the current person is already pretty much defined
  replacePersonIfNeeded( personData: any ): void
  {
    const person = this.settingsService.person;
    if ( !person || !person.surname && !person.address1 && !person.postcode && !person.city ) {
      this.settingsService.setPerson( personData );
    }
    // fill in any missing breeder numbers with the new person except when logging in. The reason for this exception is that every once in a while someone might enter a wrong breeder number when logging in, before entering the right number. Because of this, we only allow a user to change their breeder numbers on the personal details page. If a person does not have an account yet, we do accept all breeder numbers entered on the login page.
    // we fill in any missing breeder numbers in the current person with the corresponding breeder number of the new person
    for ( let newBn of personData.breederNumbers ) {
      let found = false;
      for ( let existingBn of this.breederNumbers ) {
        if ( existingBn.federation_id == newBn.federation_id ) {
          found = true;
        }
      }
      if ( !found ) this.breederNumbers.push( newBn );
    }
  }

  submitHasJustComeBackAndGuessWhat( data: BnReturn ): void
  {
    console.log(data);
    if ( data.status == BnStatus.IS_FREE || data.status == BnStatus.NEW_PERSON ) {
      this.editingNumber.breederNumber = data.breederNumber;
      this.updateActiveBreederNumber();
    } 
    if ( data.status == BnStatus.NEW_PERSON ) {
      this.replacePersonIfNeeded( data.person );
      if ( !this.inModal ) {
        this.goToPersonPage( true );
      }
      return;
    }
    // merging persons: how to merge breeder numbers: when the existing person misses a federation that the new one has, only then fill it in, but never replace. Same on server when merging persons.
    // EXTRA NOTE. When a password is entered on the login page, disregard all other breeder numbers. When password is entered on the person page, merge in the same way as when a postcode was entered.
    if ( data.status == BnStatus.INVALID ) {
      this.errorMessage = "Dit is niet een geldig fokkersnummer. Graag aanpassen.";
    }
    if ( data.status == BnStatus.HAS_PERSON ) {
      if ( !this.potentialPerson ) {
        this.potentialPerson = new PersonEntryData( data.name );
      } else {
        this.postcodeInputRef.nativeElement.focus();
        this.errorMessage = "De postcode is onjuist. Let op: hoofdletters en spaties maken geen verschil!";
      }
    }
    if ( data.status == BnStatus.HAS_USER ) {
      if ( this.potentialPerson && this.potentialPerson.hasUser ) {
        this.passwordInputRef.nativeElement.focus();
        this.errorMessage = "Het wachtwoord klopt niet.";
      } else {
        this.potentialPerson = new PersonEntryData( data.name );
        this.potentialPerson.hasUser = true;
      }
    }
  }

  revertEditingBreederNumber(): void
  {
    if (this.editingNumber) this.updateActiveBreederNumber(true);
  }

  // persist the changes to the active breeder number in the input field or by the server.
  updateActiveBreederNumber(revert = false): void
  {
    // set revert to true if the purpose is to ignore the current changes
    // using some instead of map so that we can break out after the first match.
    this.breederNumbers.some(
      (bn: BreederNumberType, index:number) => {
        if (bn.editMode) {
          this.setEditMode( bn, false );
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

  getBreederNumbersFormattedForPersonClass() {
    const breederNumbers: BreederNumber[] = [];
    for (let bn of this.breederNumbers) {
      breederNumbers.push({
        federation_id: bn.federation_id,
        breederNumber: bn.breederNumber
      });
    }
    return breederNumbers;
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
    if (!this.editingNumber.federation_id) {
      this.errorMessage = "Please select a federation in the field above.";
      this.federationInputRef.nativeElement.focus();
      return false;
    }
    this.errorMessage = "";
    return true;
  }

  doWeShowLoginList(): boolean
  {
    if (!this.breederNumbers) return false;
    if (this.potentialPerson) return false;
    if (this.breederNumbers.length > 1) return true;
    return !(this.editingNumber);
  }
}
