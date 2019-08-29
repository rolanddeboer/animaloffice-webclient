// Angular system
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Third party
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Services
import { PersonService } from 'src/app/services/person/person.service';
import { ShowService } from 'src/app/services/show/show.service';
import { DatabaseService } from 'src/app/services/database/database.service';
import { SettingsService } from 'src/app/services/config/settings.service';
import { RoutingToolsService } from 'src/app/services/config/routing-tools.service';
import { LoginService } from 'src/app/services/login/login.service';

// Components
import { LoginModalComponent } from 'src/app/components/login/login-modal/login-modal.component';

// Entities
import { Person } from 'src/app/classes/person';
import { Show } from 'src/app/classes/showType';
import { BreederNumberType } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit, AfterViewInit {
  public show = new Show;
  public person = new Person;
  public validationErrors: Object = {};
  public loading = false;
  public countries: Object;
  public months = [ 
    "January", "February", "March", "April", "May", "June", "July", 
    "August", "September", "October", "November", "December"
  ];
  public days = Array(31).fill(0, 0, 31).map( (x, i) => i+1 );
  public years = Array(100).fill(0, 0, 100).map( (x, i) => 0-i+(new Date).getFullYear() );
  @ViewChild("firstNameInput", { "static": false }) firstNameInput: ElementRef;
  @ViewChild("surnameInput", { "static": false }) surnameInput: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private showService: ShowService,
    public db: DatabaseService,
    private settings: SettingsService,
    private routingTools: RoutingToolsService,
    private modalService: NgbModal,
    private loginService: LoginService
  ) { 
    this.settings.logoutCompleted.subscribe(() => {
      this.routingTools.navigateToRoute( "home" );
    });
  }

  ngOnInit(): void
  {
    if ( !this.settings.person ) {
      this.routingTools.navigateToRoute( "login" );
    } else {
      this.person = this.settings.person;
    }
    for ( let breederNumber of this.person.breederNumbers ) {
      const newBn = new BreederNumberType();
      newBn.breederNumber = breederNumber.breederNumber;
      newBn.federation = this.db.find("BreederFederation", breederNumber.federation_id);
      this.loginService.breederNumbers.push( newBn );
    }
    this.loginService.editingNumber = null;
    //this.route.params.subscribe( params => this.showService.setShow(params) );

    // const that = this;
    // this.personService.getDetails().subscribe( {
    //   next( data: Object ): void {
    //     that.countries = data["countries"];
    //     that.updatePerson( data["person"] );
    //     console.log( data["person"], that.person );
    //   },
    //   error( error: string ): void {
    //     console.error( error );
    //   }
    // });
  }

  ngAfterViewInit(): void
  {
    if (this.person.isCombination) {
      this.surnameInput.nativeElement.focus();
    } else {
      this.firstNameInput.nativeElement.focus();
    }
  }

  updatePerson( person: Person ): void
  {
    person.setBirthday( person.birthday );
    this.person = new Person ( person );
  }

  hasErrors()
  {
    return Object.keys(this.validationErrors).length;
  }

  resetDate(): void
  {
    this.person.setBirthday();
    // this.person.birthday.setDate( 1 );
    // this.person.birthday.setMonth( 0 );
    // this.person.birthday.setFullYear( 2000 );
  }

  updateDateFromForm(): void
  {
    this.person.birthday.setDate( this.person.birthday_day );
    this.person.birthday.setMonth( this.person.birthday_month );
    this.person.birthday.setFullYear( this.person.birthday_year );
  }

  onSubmit(): void
  {
    if ( this.person.isYouth ) {
      this.updateDateFromForm();
    } else {
      this.resetDate();
    }

    this.loading = true;
    const that = this;

    this.personService.savePerson( this.person ).subscribe( {
      next( validationErrors: Object ): void {
        that.validationErrors = validationErrors
        that.loading = false;
      },
      error( error: string ): void {
        console.error( error );
        that.loading = false;
      }
    } );
  }

  changeBreederNumbersClick()
  {
    this.modalService
      .open(LoginModalComponent, {
        "backdrop": "static"
      })
      .result
      .then((result) => {
        console.log(result);
      }, (reason) => {
        console.log(reason);
      });
    ;
  }
}
