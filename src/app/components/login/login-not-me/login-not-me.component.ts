import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-login-not-me',
  templateUrl: './login-not-me.component.html',
  styleUrls: ['./login-not-me.component.scss']
})
export class LoginNotMeComponent implements OnInit {
  notMeButNumberCorrect = false;

  constructor(
    public loginService: LoginService
  ) { }

  ngOnInit() {
  }
}
