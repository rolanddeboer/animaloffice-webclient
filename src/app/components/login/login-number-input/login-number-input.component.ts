import { Component, OnInit, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-login-number-input',
  templateUrl: './login-number-input.component.html',
  styleUrls: ['./login-number-input.component.scss']
})
export class LoginNumberInputComponent implements OnInit, AfterContentInit {
  @ViewChild('breederNumberInput') breederNumberInput: ElementRef;
  @ViewChild('associationInput') associationInput: ElementRef;
  @ViewChild('footer') footer: ElementRef;

  constructor(
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.loginService.breederNumberInputRef = this.breederNumberInput;
    this.loginService.associationInputRef = this.associationInput;
    setTimeout(() => this.breederNumberInput.nativeElement.focus(), 100);
  }

  ngAfterContentInit(){
    this.breederNumberInput.nativeElement.focus();
  }
  submitNumberClick() {
    this.loginService.submit(this.footer);
  }
  onAssociationChange() {
    this.breederNumberInput.nativeElement.focus();
  }

}
