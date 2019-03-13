import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login/login.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-name-checker',
  templateUrl: './login-name-checker.component.html',
  styleUrls: ['./login-name-checker.component.scss']
})
export class LoginNameCheckerComponent implements OnInit {

  constructor(
    public loginService: LoginService
  ) { }

  ngOnInit() {
  }

  confirm() {
    this.loginService.confirmName();
  }

}
