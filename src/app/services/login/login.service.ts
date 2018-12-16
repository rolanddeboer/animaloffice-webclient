import { Injectable, ElementRef } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators';
import { SpinnerService } from '../spinner/spinner.service';
import { RoutingToolsService } from '../config/routing-tools.service';
import { SettingsService } from '../config/settings.service';

class BreederNumberType {
  breederNumber: string;
  associationId: number;
  associationName?: string;
  editMode?: boolean;

  constructor() {
    this.breederNumber = '';
    this.associationId = 0;
  }
}
class AssociationType {
  id: number;
  name: string;
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
  public editingNumber: BreederNumberType;
  public associations: AssociationType[] = [];
  public person: PersonType;
  public forLogin = true;
  public errorMessage: string;
  public loading = false;
  public notMe = false;
  public breederNumberInputRef: ElementRef;
  public associationInputRef: ElementRef;
  private postcodes: string[] = [];
  private person_id: string;
  private person_code: string;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    }),
    withCredentials: true
  };

  constructor(
    private http: HttpClient,
    private spinner: SpinnerService,
    private routingTools: RoutingToolsService,
    private settingsService: SettingsService
  ) { 
    this.start(); 
    // this.retrieveAssociations()
    //   .subscribe((data: any) => {
    //     this.setAssociations(data['associations']);
    //   })
    // ;
  }
  start() {
    this.setAssociations(this.settingsService.defaultData.associations);
    console.log(this.settingsService.defaultData.associations);
    if (!this.breederNumbers.length) {
      this.addNumber();
    }
  }
  reset() {
    this.updateActiveBreederNumber(true);
    this.person = null;
  }
  getFreeAssociations() {
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
  deleteNumber(id: number): void {
    // roll back any current changes
    this.updateActiveBreederNumber(true);
    this.breederNumbers.splice(id, 1);
    if (!this.breederNumbers.length) {
      this.addNumber();
    }
  }
  editNumber(id: number): void {
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
  notMeEditAgain() {
    this.person = null;
    this.notMe = false;
    setTimeout(() => this.breederNumberInputRef.nativeElement.focus(), 100);
  }
  addNumber() {
    const newBn = new BreederNumberType;
    newBn.associationId = this.getFreeAssociations()[0].id;
    this.breederNumbers.push(newBn);
    // edit the last breeder number, which is the one we just added
    this.editNumber(this.breederNumbers.length - 1);
  }
  confirmName(spinnerContainer: ElementRef) {
    if (this.person.postcode) {
      this.postcodes.push(this.person.postcode);
    }
  }
  submit(spinnerContainer: ElementRef) {
    if (this.validateForm()) {
      const data = this.compileData();
      data['sudo'] = 0;
      data['force'] = 0;
      console.log(JSON.stringify(data));
      this.startSpinner(spinnerContainer);
      this.submitBreederNumber(data)
      .subscribe(
        (data: any) => {
          this.formSubmitted(data);
        })
      ;
    }
  }
  formSubmitted(data: any): void {
    this.stopSpinner();
    if (!('status' in data) || typeof data.status !== 'string') {
      this.errorMessage = "Something went wrong. Please try again in 5 minutes.";
      return;
    }
    if (data.status === 'error') {
      this.errorMessage = data.message;
      return;
    }
    this.errorMessage = '';
    this.person_id = data.person_id;
    if ('person_code' in data) {
      this.person_code = data.person_code;
    }
    if (data.name) {
      this.person = new PersonType(data.name, data.username);
    } else if (data.userLogin) {
      this.settingsService.setUsername(data.userLogin);
      console.log(this.settingsService.username);
      this.reset();
      this.routingTools.navigateToRoute('home');
    } else {
      this.editingNumber.associationId = data.association_id;
      this.editingNumber.associationName = this.getAssociationNameById(this.editingNumber.associationId); 
      this.editingNumber.breederNumber = data.breederNumber;
      this.updateActiveBreederNumber();
    }
    console.log(data);
  }
  updateActiveBreederNumber(revert = false) {
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

  startSpinner(spinnerContainer) {
    this.loading = true;
    this.spinner.start(spinnerContainer);
  }
  stopSpinner() {
    this.loading = false;
    this.spinner.stop();
  }
  validateForm() {
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
    this.errorMessage = '';
    return true;
  }
  compileData() {
    return {
      association_id: this.editingNumber.associationId * 1,
      number: this.editingNumber.breederNumber.trim(),
      postcodes: this.postcodes,
      password: this.person ? this.person.password : '',
      person_id: 0,
      isAdmin: 0,
      isOther: 0,
      isAnonymous: 1,
      show_slug: '',
      forLogin: 1,
    }
  }

  addBreederNumber(breederNumber: BreederNumberType): void {
    breederNumber.associationName = this.getAssociationNameById(breederNumber.associationId);
    this.breederNumbers.push(breederNumber);
  }
  submitBreederNumber (submitData): Observable<any> {
    const url = 'http://localhost:8000/api/login/submit/breeder-number';
    return this.http.post<any>(url, submitData, this.httpOptions)
    .pipe(
      catchError(error => this.handleError(error))
    );
  }

  setAssociations(associations: AssociationType[]): void {
    if (Array.isArray(associations)) {
      this.associations = associations;
    }
  }

  retrieveAssociations() {
    const url = 'http://localhost:8000/api/regions/1/get-associations';
    return this.http.get<any>(url)
    .pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
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

  private handleError(error: HttpErrorResponse) {
    this.stopSpinner();
    this.errorMessage = 'Something went wrong. Try reloading the page.';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(error.message);
      if (typeof error.error === 'object' && 'message' in error.error) {
        console.error('Server responded:', error.error['message']);
      } else {
        console.error('Server gave no extra details.');
      }
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something went wrong.');
  };

  doWeShowLoginList() {
    if (!this.breederNumbers) return false;
    if (this.person) return false;
    if (this.breederNumbers.length > 1) return true;
    return !(this.editingNumber);
  }


}
