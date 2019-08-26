import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from 'src/app/services/login/login.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-name-checker',
  templateUrl: './login-name-checker.component.html',
  styleUrls: ['./login-name-checker.component.scss']
})
export class LoginNameCheckerComponent implements AfterViewInit {
  @ViewChild('passwordInput', {static: false}) passwordInput: ElementRef;

  constructor(
    public loginService: LoginService
  ) { }

  ngAfterViewInit() {
    this.loginService.passwordInputRef = this.passwordInput;
  }

  confirm() {
    this.loginService.confirmName();
  }

}
