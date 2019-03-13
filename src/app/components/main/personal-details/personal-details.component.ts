// Angular system
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Services
import { PersonService } from 'src/app/services/person/person.service';
import { ShowService } from 'src/app/services/show/show.service';

// Entities
import { Person } from 'src/app/classes/person';
import { Show } from 'src/app/classes/showType'

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {
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

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private showService: ShowService
  ) { }

  ngOnInit(): void
  {
    this.route.params.subscribe( params => this.showService.setShow(params) );

    const that = this;
    this.personService.getDetails().subscribe( {
      next( data: Object ): void {
        that.countries = data["countries"];
        that.updatePerson( data["person"] );
        console.log( data["person"], that.person );
      },
      error( error: string ): void {
        console.error( error );
      }
    });
  }

  updatePerson( person: Person ): void
  {
    person.birthday = new Date( person.birthday );
    person.birthday_day = person.birthday.getDate();
    person.birthday_month = person.birthday.getMonth();
    person.birthday_year = person.birthday.getFullYear();
    this.person = new Person ( person );
  }

  hasErrors()
  {
    return Object.keys(this.validationErrors).length;
  }

  resetDate()
  {
    this.person.birthday.setDate( 1 );
    this.person.birthday.setMonth( 0 );
    this.person.birthday.setFullYear( 2000 );
  }

  updateDateFromForm()
  {
    this.person.birthday.setDate( this.person.birthday_day );
    this.person.birthday.setMonth( this.person.birthday_month );
    this.person.birthday.setFullYear( this.person.birthday_year );
  }

  onSubmit()
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

}