import { Component, OnInit } from '@angular/core';
import { RoutingToolsService } from 'src/app/services/config/routing-tools.service';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-login-header',
  templateUrl: './login-header.component.html',
  styleUrls: ['./login-header.component.scss']
})
export class LoginHeaderComponent implements OnInit {

  constructor(
    public routingTools: RoutingToolsService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
  }

  navigateHome() {
    this.loginService.reset();
    this.routingTools.navigateToRoute('home');
  }

}
