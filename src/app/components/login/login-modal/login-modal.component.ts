// Angular system
import { Component, OnInit } from '@angular/core';

// Third party
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Services
import { LoginService } from 'src/app/services/login/login.service';
import { DatabaseService } from 'src/app/services/database/database.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {

  constructor(
    public loginService: LoginService,
    public db: DatabaseService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.loginService.inModal = true;
    console.log( "modal init" );
  }

}
