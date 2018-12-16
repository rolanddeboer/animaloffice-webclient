import { Injectable, LOCALE_ID, Inject, EventEmitter } from '@angular/core';
import defaultData from '../../misc/default-data.json';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public themeUpdated = new EventEmitter<string>();
  public username;
  public defaultData;

  private languages = {
    'en-US': {
      name: 'English',
      prefix: 'en'
    },
    'nl-NL': {
      name: 'Nederlands',
      prefix: 'nl'
    }
  }
  private backgroundNumber = String(Math.floor(Math.random() * 10));

  constructor(
    @Inject(LOCALE_ID) protected localeId: string
  ) { 
    this.defaultData = defaultData;
    if ('username' in defaultData && defaultData.username) {
      // this.username = defaultData.username;
    }
  }

  isOperaMini() {
    return (navigator.userAgent.indexOf('Opera Mini') > -1);
    // var isOperaMini = Object.prototype.toString.call(window.operamini) === "[object OperaMini]"
  }

  setUsername(name: string) {
    this.username = name;
  }

  getBackgroundNumberWide(): string {
    return this.backgroundNumber;
  }
  getBackgroundNumberSquare(): string {
    return this.backgroundNumber;
  }
  getLocaleId(): string {
    return this.localeId;
  }

  getLanguageName(): string {
    if (this.localeId in this.languages) {
      return this.languages[this.localeId].name;
    } else {
      return this.localeId;
    }
  }

  getLanguagePrefix(): string {
    if (this.localeId in this.languages) {
      return this.languages[this.localeId].prefix;
    } else {
      return this.localeId;
    }
  }
}
