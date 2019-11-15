import { Person } from 'src/app/classes/person';

export class InitData
{
  regions: Region[];
  breederFederations: BreederFederation[] = [];
  showOveralls: ShowOverall[] = [];
  showStatuses: ShowStatus[];
  shows: Show[] = [];
  person: Person;
  animals: Animal[];
  breeds: Breed[];
  breedColours: BreedColour[];
  breedGroups: BreedGroup[];
  countries?: Country[];
  breedToBreedColours: number[][];
}

// export class LoginInitData
// {
//   animals: Animal[];
//   breeds: Breed[];
//   breedColours: BreedColour[];
//   breedGroups: BreedGroup[];
//   countries?: Country[];
//   breedToBreedColours: number[][];
//   person: Person;
// }

export class Region
{
  id: number;
  name: string;
  code: string;
  defaultCountry_id: number;
}

export class BreederFederation
{
  id: number;
  name: string;
}

export class ShowLogo
{
  static readonly LANDSCAPE = "landscape";
  static readonly SQUARE = "square";
  static readonly PORTRAIT = "portrait";

  constructor(
    public filename: string,
    public width: number,
    public height: number
  ) { }

  // get areaSize(): number
  // {
  //   return this.width * this.height;
  // }

  get proportion(): number
  {
    return this.width / this.height;
  }

  // get area(): number
  // {
  //   return this.width * this.height;
  // }

  getProportionalWidth( widthForSquare: number ): number
  {
    return Math.round( Math.sqrt ( widthForSquare**2 * this.proportion) );
  }

  getProportionalWidthInPx( widthForSquare: number ): string
  {
    return this.getProportionalWidth (widthForSquare) + 'px';
  }

  get fileLocation(): string
  {
    return "images/shows/" + this.filename;
  }

  get orientation(): string
  {
    let proportion = this.proportion;
    if ( proportion < .75 ) return ShowLogo.PORTRAIT;
    if ( proportion < 1.25 ) return ShowLogo.SQUARE;
    return ShowLogo.LANDSCAPE;
  }
}

export class ShowOverall
{
  logoFile?: string;
  logoWidth?: number;
  logoHeight?: number;

  id: number;
  locale: string;
  slug: string;
  name: string;
  shortName: string;

  logo: ShowLogo;
  shows: Show[];

  constructor( raw: ShowOverall )
  {
    Object.assign( this, raw );
    this.logo = new ShowLogo( raw.logoFile, raw.logoWidth, raw.logoHeight );
    delete this.logoFile;
    delete this.logoWidth;
    delete this.logoHeight;
  }
}

export interface ShowStatus {
  id: number;
  slug: string;
  position: number;
  hide: boolean;
  name: string;
}

export class Show
{
  name: string;
  shortName: string;
  showOverallSlug: string;
  subscribeFrom:  Date;
  subscribeTo: Date;
  startsAt: Date;
  endsAt: Date;
  contactDetails: string;
  siteUrl: string;
  edition: string;
  editionSlug: string;
  showOverall: ShowOverall;
  showStatus: ShowStatus;
  showStatus_id: number;
  showOverall_id: number;

  constructor( raw: Show )
  {
    Object.assign( this, raw );
    this.subscribeFrom = new Date( raw.subscribeFrom );
    this.subscribeTo = new Date( raw.subscribeTo );
    this.startsAt = new Date( raw.startsAt );
    this.endsAt = new Date( raw.endsAt );
  }
}

export class Animal
{
  id: number;
  name: string;
  allowCouples: boolean;
  hasColoursPerBreedGroup: boolean;
  isBackup: boolean;
  position: number;
}

export class BreedColour
{
  id: number;
  animal_id: number;
  name: string;
  isBackup: boolean;
  position: number;
}

export class Breed
{
  id: number;
  animal_id: number;
  breedGroup_id: number;
  name: string;
  isBackup: boolean;
  position: number;
}

export class BreedGroup
{
  id: number;
  animal_id: number;
  name: string;
  isBackup: number;
  position: number;
}

export class Country
{
  id: number;
  name: string;
}
