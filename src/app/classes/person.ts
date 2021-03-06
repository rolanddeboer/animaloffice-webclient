export class BreederNumber
{
  federation_id: number;
  breederNumber: string;
}

export class Person
{
  fullName?: string;
  person_id: number;
  uuid: string;
  country_id: number;
  firstName: string;
  surname: string;
  surnamePrefix: string;
  city: string;
  postcode: string;
  address1: string;
  address2: string;
  phone1: string;
  phone2: string;
  email: string;
  iban: string;
  isYouth = false;
  birthday: Date;
  birthday_day: number;
  birthday_month: number;
  birthday_year: number;
  password?: string;
  passwordAgain?: string;

  breederNumbers: BreederNumber[] = [];

  private _isCombination = false;
  private _isPerson = true;

  constructor ( data: any = null )
  {
    if ( data ) {
      Object.assign( this, data );
    }
    this.setBirthday(); 
  }

  setBirthday( date: Date | string = null ): void
  {
    if ( !date ) date = "2000-01-01";
    if ( !(this.birthday instanceof Date) ) {
      this.birthday = new Date( date );
    }
    this.birthday_day = this.birthday.getDate();
    this.birthday_month = this.birthday.getMonth();
    this.birthday_year = this.birthday.getFullYear();
  }

  set isPerson( isPerson: boolean )
  {
    this._isPerson = isPerson;
    this._isCombination = !isPerson;
  }

  get isPerson(): boolean
  {
    return this._isPerson;
  }

  set isCombination( isCombination: boolean )
  {
    this._isPerson = !isCombination;
    this._isCombination = isCombination;
  }

  get isCombination()
  {
    return this._isCombination;
  }

  isNew() {
    return this.person_id === undefined;
  }
}