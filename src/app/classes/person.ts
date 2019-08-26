export class BreederNumber
{
  federation_id: number;
  federation_name: string;
  breederNumber: string;
  breederNumber_id: number;
}

export class Person
{
  fullName?: string;
  person_id: number;
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

  breederNumbers: BreederNumber[] = [];

  private _isCombination = false;
  private _isPerson = true;

  constructor ( data = null )
  {
    if ( data ) {
      Object.assign( this, data );
    } else {
      this.setBirthday();
    } 
  }

  setBirthday( date: Date | string = null ): void
  {
    if ( !date ) date = "2000-01-01";
    this.birthday = new Date( date );
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