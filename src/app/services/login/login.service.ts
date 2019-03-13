import { Injectable, ElementRef } from '@angular/core';
import { SpinnerService } from '../spinner/spinner.service';
import { RoutingToolsService } from '../config/routing-tools.service';
import { SettingsService } from '../config/settings.service';
import { BreederNumberHandlerService } from './breeder-number-handler.service';
import { BreederFederation } from 'src/app/classes/initData';
import { DatabaseService } from '../database/database.service';

class BreederNumberType {
  breederNumber: string;
  associationId: number;
  associationName?: string;
  editMode?: boolean;
  persisted: boolean;

  constructor() {
    this.breederNumber = '';
    this.associationId = 0;
    this.persisted = false;
  }
}

interface FederationInfo {
  federation: BreederFederation;
  free: boolean;
}

class AssociationType extends BreederFederation {
  free?: boolean;
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

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public breederNumbers: BreederNumberType[] = [];
  public persistingBreederNumbers: BreederNumberType[] = [];
  public currentlyPersistingId: number;
  public editingNumber: BreederNumberType;
  public associations: AssociationType[] = [];
  public person: PersonType;
  public forLogin = true;
  public errorMessage: string;
  public loading = false;
  public notMe = false;
  public breederNumberInputRef: ElementRef;
  public associationInputRef: ElementRef;
  private person_id: string;
  private person_code: string;
  public persistingAll = false;
  private spinnerCounter = 0;


  constructor(
    private spinner: SpinnerService,
    private routingTools: RoutingToolsService,
    private db: DatabaseService,
    // private settingsService: SettingsService,
    private bnHandler: BreederNumberHandlerService
  ) { 
    this.start(); 
    // this.retrieveAssociations()
    //   .subscribe((data: any) => {
    //     this.setAssociations(data['associations']);
    //   })
    // ;
  }
  start() {
    if ( this.db.has("BreederAssociation") ) {
      this.associations = this.db.get("BreederAssociation")
      // this.setAssociations(this.db.get("BreederAssociation"));
      if (!this.breederNumbers.length) {
        this.addNumber();
      }
    } else {
      setTimeout( () => this.start(), 50 );
    }
  }
  reset() {
    this.updateActiveBreederNumber(true);
    this.person = null;
  }

  // setAssociations(associations: AssociationType[]): void 
  // {
  //   if (Array.isArray(associations)) {
  //     this.associations = associations;
  //   }
  // }

  getFreeAssociations() 
  {
    const associations: AssociationType[] = [];
    for (let ass of this.associations) {
      let free = true;
      for (let bn of this.breederNumbers) {
        if (bn.associationId === ass.id && !bn.editMode) {
          free = false;
        }
      }
      if (free) {
        associations.push(ass);
      }
    }
    return associations;
  }

  addNumber() 
  {
    const newBn = new BreederNumberType;
    newBn.associationId = this.getFreeAssociations()[0].id;
    this.breederNumbers.push(newBn);
    // edit the last breeder number, which is the one we just added
    this.editNumber(this.breederNumbers.length - 1);
  }

  editNumber( id: number ): void 
  {
    // roll back any current changes
    this.updateActiveBreederNumber(true);
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
    this.updateActiveBreederNumber(true);
    this.breederNumbers.splice(id, 1);
    if (!this.breederNumbers.length) {
      this.addNumber();
    }
  }

  notMeEditAgain() 
  {
    this.person = null;
    this.notMe = false;
    setTimeout(() => this.breederNumberInputRef.nativeElement.focus(), 100);
  }

  confirmName( spinnerName = "" ) 
  {
    if ( this.person.postcode ) {
      this.bnHandler.postcodes.push(this.person.postcode);
    }
    if ( this.person.password ) {
      this.bnHandler.password = this.person.password;
    }
    this.submit( );
  }

  saveAll( )
  {
    this.persistingAll = true;
    // this.persistingBreederNumbers = [];
    // for ( let breederNumber of this.breederNumbers ) {
    //   if ( !breederNumber.persisted ) {
    //     this.persistingBreederNumbers.push( breederNumber );
    //   }
    // }
    this.persistNext();
  }

  persistNext(): void
  {
    // mark the first breeder number as persisted
    // if ( this.persistingBreederNumbers.length ) {
    //   const breederNumber = this.persistingBreederNumbers.shift();
    //   breederNumber.persisted = true;
    // }

    // // persist the next one
    // if ( this.persistingBreederNumbers.length ) {
    //   this.editingNumber = { ...this.persistingBreederNumbers[ 0 ] };
      
    // } else {
    //   this.persistingAll = false;
    //   alert( "Welcome!" );
    // }

    let foundOne = false;
    for ( let id = 0; id < this.breederNumbers.length; id ++ ) {
      if ( !this.persistingAll ) break;
      if ( !this.breederNumbers[id].persisted ) {
        foundOne = true;
        this.breederNumbers[id].persisted = true;
        this.editNumber( id );
        this.submit();
        break;
      }
    }
    if ( !foundOne ) {
      this.persistingAll = false;
      alert( "Welcome!" );
    }
  }

  submit( spinnerName = "" ) 
  {
    if (this.validateForm()) {
      // const data = this.compileData();
      // console.log(JSON.stringify(data));
      this.startSpinner();
      const that = this;
      this.bnHandler.persist = this.persistingAll;
      this.bnHandler
        .submit( this.editingNumber )
        .subscribe( {
          next(data) { 
            // console.log(data);
            that.stopSpinner();
            if ( data.person ) {
              that.person = data.person;
            }
            if ( data.loggedIn ) {
              that.reset();
              that.routingTools.navigateToRoute('home');
            }
            if ( data.addNumber ) {
              if ( that.persistingAll ) {
                that.editingNumber.persisted = true;
              }
              that.editingNumber = data.breederNumber;
              that.updateActiveBreederNumber();
            }
            if ( that.persistingAll ) {
              that.persistNext();
            }
          },
          error(error) { 
            if ( that.persistingAll ) {
              that.persistingAll = false;
            }
            that.errorMessage = error;
            that.stopSpinner();
            that.breederNumberInputRef.nativeElement.focus();
          }
        } )
      ;
    }
  }

  updateActiveBreederNumber(revert = false) 
  {
    // set revert to true if the purpose is to ignore the current changes
    // using some instead of map so that we can break out after the first match.
    this.breederNumbers.some(
      (bn: BreederNumberType, index:number) => {
        if (bn.editMode) {
          this.editingNumber.editMode = false;
          this.editingNumber.associationName = this.getAssociationNameById(this.editingNumber.associationId);
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

  startSpinner( spinnerName = "" ) 
  {
    this.spinnerCounter ++;
    // console.log( "starting spinner nr. ", this.spinnerCounter );
    this.loading = true;
    // this.spinner.showGroup("login");
  }

  stopSpinner() 
  {
    this.spinnerCounter --;
    // console.log( "stopping spinner nr. ", this.spinnerCounter );
    if ( this.spinnerCounter == 0 ) {
      // console.log( "this was the last spinner." );
      this.loading = false;
      // this.spinner.hideGroup("login");
    }
  }

  validateForm() 
  {
    if (!this.editingNumber.breederNumber.trim()) {
      this.errorMessage = "Please fill in the breeder number in the field above.";
      this.breederNumberInputRef.nativeElement.focus();
      return false;
    }
    if (!this.editingNumber.associationId) {
      this.errorMessage = "Please select an association in the field above.";
      this.associationInputRef.nativeElement.focus();
      return false;
    }
    this.errorMessage = "";
    return true;
  }

  // addBreederNumber(breederNumber: BreederNumberType): void {
  //   breederNumber.associationName = this.getAssociationNameById(breederNumber.associationId);
  //   this.breederNumbers.push(breederNumber);
  // }

  // retrieveAssociations() {
  //   const url = this.settingsService.servername + '/api/regions/1/get-associations';
  //   return this.http.get<any>(url)
  //   .pipe(
  //     retry(3),
  //     catchError(this.handleError)
  //   );
  // }
  getAssociationById(id: number): AssociationType {
    id = id * 1;
    const association = this.associations.find((element: AssociationType) => { 
      return element.id === id; 
    });
    return association || null;
  }
  getAssociationNameById(id: number) {
    const association = this.getAssociationById(id);
    return association ? association.name : '';
  }

  doWeShowLoginList() {
    if (!this.breederNumbers) return false;
    if (this.person) return false;
    if (this.breederNumbers.length > 1) return true;
    return !(this.editingNumber);
  }

}
