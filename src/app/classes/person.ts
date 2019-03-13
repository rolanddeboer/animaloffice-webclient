export class BreederNumber
{
  association_id: number;
  association_name: string;
  breederNumber: string;
  breederNumber_id: number;
}

export class Person
{
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
  isYouth: boolean;
  birthday: Date;
  birthday_day: number;
  birthday_month: number;
  birthday_year: number;

  breederNumbers: BreederNumber[] = [];

  private _isCombination: boolean;
  private _isPerson: boolean;

  constructor ( data = null )
  {
    if ( data ) {
      Object.assign( this, data );
    } 
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
}