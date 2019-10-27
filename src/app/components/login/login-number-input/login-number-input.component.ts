import { Component, OnInit, AfterContentInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-login-number-input',
  templateUrl: './login-number-input.component.html',
  styleUrls: ['./login-number-input.component.scss']
})
export class LoginNumberInputComponent implements OnInit, AfterContentInit {
  @ViewChild('breederNumberInput', {static: true}) breederNumberInput: ElementRef;
  @ViewChild('federationInput', {static: false}) federationInput: ElementRef;

  constructor(
    public loginService: LoginService
  ) { }

  ngOnInit() {
    // setTimeout(() => this.breederNumberInput.nativeElement.focus(), 100);
  }
  ngAfterViewInit(){
    this.loginService.federationInputRef = this.federationInput;
    this.loginService.breederNumberInputRef = this.breederNumberInput;
    // this.breederNumberInput.nativeElement.focus();
  }

  ngAfterContentInit(){
    // this.breederNumberInput.nativeElement.focus();
  }
  onFederationChange() {
    this.breederNumberInput.nativeElement.focus();
    this.loginService.dismissNameChecker();
  }
  submit() {
    this.loginService.checkNumber();
  }
  cancel() {
    this.loginService.cancelEditing();
  }

}
