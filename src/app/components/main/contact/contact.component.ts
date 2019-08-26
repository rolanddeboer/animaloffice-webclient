import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators';
import { SettingsService } from 'src/app/services/config/settings.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from '../../../services/spinner/spinner.service';

class Fields {
  public name = '';
  public email = '';
  public subject = '';
  public message = '';
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  public fields = new Fields;
  public errorMessage = '';
  public emailError: boolean;
  public submitting = false;
  @ViewChild('contactModal', {static: false}) contactModal: ElementRef;
  @ViewChild('contactForm', {static: false}) contactForm;

  constructor(
    private settingsService: SettingsService,
    private http: HttpClient,
    private modalService: NgbModal,
    private spinner: SpinnerService
  ) { }

  ngOnInit() {
  }

  changeEmail() {
    this.emailError = (this.fields.email && !this.validateEmail())
  }
  validateEmail() {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(this.fields.email);
  }
  submit(): void {
    console.log(this.contactForm);
    for (var i in this.contactForm.form.controls) {
      this.contactForm.form.controls[i].markAsTouched();
    }
    if (!this.validateFields()) {
      this.errorMessage = "Please fill in the required fields";
      return;
    }
    this.errorMessage = '';
    this.startSpinner();
    console.log('fields: ', this.fields);
    this.submitSubmit().subscribe(
      responseData => {
        this.stopSpinner();
        this.fields = new Fields;
        this.modalService.open(this.contactModal, {centered: true});
      })
    ;
  
  }
  submitSubmit(): Observable<any> {
    const url = this.settingsService.getUriStartApiLocale() + '/contact';
    return this.http.post<any>(url, this.fields, this.settingsService.httpOptions)
    .pipe(
      retry(3),
      catchError(error => {
        this.stopSpinner();
        return throwError('Sending message failed')
      })
    );
  }
  validateFields() {
    return (this.fields.email && this.fields.message && this.validateEmail());
  }
  startSpinner() {
    this.submitting = true;
    this.spinner.show( "contact" );
  }
  stopSpinner() {
    this.submitting = false;
    this.spinner.hide( "contact" );
  }

}
