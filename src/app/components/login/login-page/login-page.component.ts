import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SettingsService } from 'src/app/services/config/settings.service';
import { LoginService } from 'src/app/services/login/login.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(
    private loginService: LoginService,
  ) { }

  ngOnInit() {
   }


}
