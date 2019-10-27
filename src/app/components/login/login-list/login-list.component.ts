import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from 'src/app/services/login/login.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login-list',
  templateUrl: './login-list.component.html',
  styleUrls: ['./login-list.component.scss']
})
export class LoginListComponent implements OnInit {
  @Input("modal") modal: NgbActiveModal;

  constructor(
    public loginService: LoginService
  ) { }

  ngOnInit() {
  }

  proceedClick() {
  }

  closeModal() {
    this.modal.dismiss( null );
    this.loginService.reset();
  }

  submit() {
    if ( this.loginService.inModal ) {
      this.modal.close( this.loginService.getBreederNumbersFormattedForPersonClass() );
    } else {
      this.loginService.goToPersonPage();
    }
    //this.loginService.saveAll()
  }

}
