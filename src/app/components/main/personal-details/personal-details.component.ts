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
import { BreederNumberHandlerService } from 'src/app/services/login/breeder-number-handler.service';
import { ModalComponent } from '../../pages/modal/modal.component';

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
  public newUser = true;
  public acceptTerms = false;
  public acceptTermsError = false;
  @ViewChild("firstNameInput", { "static": false }) firstNameInput: ElementRef;
  @ViewChild("surnameInput", { "static": false }) surnameInput: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private bnHandler: BreederNumberHandlerService,
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
    this.settings.whenInitialized.then(
      () => {
        if (!this.settings.person) {
          this.routingTools.navigateToRoute( "login" );
        }
        this.person = this.settings.person;
        if ( this.loginService.modalOpen ) {
          this.openBnModal();
        }
      }
    );
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

  setBreederNumbers(): void
  {
    this.loginService.setBreederNumbers( this.person.breederNumbers );
    // let breederNumbers: BreederNumberType[] = [];
    // for ( let breederNumber of this.person.breederNumbers ) {
    //   breederNumbers.push( {
    //     breederNumber: breederNumber.breederNumber,
    //     federation_id: breederNumber.federation_id
    //   } );
    // }
    // this.loginService.breederNumbers = breederNumbers;
  }

  ngAfterViewInit(): void
  {
    this.settings.whenInitialized.then(
      () => {
        if (this.person && this.person.isCombination) {
          this.surnameInput.nativeElement.focus();
        } else {
          this.firstNameInput.nativeElement.focus();
        }
      }
    );
  }

  updatePerson( person: Person ): void
  {
    this.person = new Person ( person );
  }

  hasErrors()
  {
    return Object.keys(this.validationErrors).length;
  }

  updateBirthDateFromForm(): void
  {
    this.person.birthday.setDate( this.person.birthday_day );
    this.person.birthday.setMonth( this.person.birthday_month );
    this.person.birthday.setFullYear( this.person.birthday_year );
  }

  onSubmit(): void
  {
    console.log( this.person );
    if ( !this.validatePersonBeforeSaving() ) return;
    this.loading = true;

    this.saveBreederNumbers()
      .then( this.savePerson )
      .then( () => {
        this.loading = false;
      })
      .catch((error: string) => {
        console.error( error );
        this.loading = false;
      })
    ;

    return;

    // this.personService.savePerson( this.person ).subscribe( {
    //   next( validationErrors: Object ): void {
    //     that.validationErrors = validationErrors
    //     that.loading = false;
    //   },
    //   error( error: string ): void {
    //     console.error( error );
    //     that.loading = false;
    //   }
    // } );
  }

  private saveBreederNumbers(): Promise<any>
  {
    return this.bnHandler.saveAll( this.person.breederNumbers )
    .then((data: any) => {
      console.log( data );
      if (data.issues.length) {
        this.openBnModal();
        this.loginService.editNumberByFederationId( data.issues[0]["federation_id"] );
        this.loginService.submitHasJustComeBackAndGuessWhat( data.issues[0] );
      }
    })
  }
  
  private savePerson(): Promise<any>
  {
    this.validationErrors = null;
    return this.personService.createProfile( this.person, this.loginService.postcodes )
    .then( ( data: Object ) => {
      console.log( data );
      if ( data["personErrors"] ) {
        this.validationErrors = data["personErrors"];
      }
    });
  }

  private validatePersonBeforeSaving(): boolean
  {
    if ( this.person.isYouth ) {
      // set string date based on display date
      this.updateBirthDateFromForm();
    } else {
      // make sure that if isYouth was deselected, any existing birth date is replaced by 2000-01-01
      this.person.setBirthday();
    }

    if ( this.newUser ) {
      if ( !this.acceptTerms ) {
        this.acceptTermsError = true;
        return false;
      } else {
        this.acceptTermsError = false;
      }
      // make sure that the password property exists so that the server will validate it.
      if ( !this.person.password ) this.person.password = "";
    }

    return true;
  }

  openBnModal()
  {
    this.setBreederNumbers();
    this.modalService
      .open(LoginModalComponent, {
        "backdrop": "static"
      })
      .result
      .then((breederNumbers) => {
        this.person.breederNumbers = breederNumbers;
      }, (reason) => {
        console.log(reason);
      });
    ;
  }

  openPageModal( page: string ): void
  {
    this.setBreederNumbers();
    const modal = this.modalService
      .open(ModalComponent, {
        size: "lg",
        scrollable: true
      })
    ;
    modal.componentInstance.page = page;
  }
}
