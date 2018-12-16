import { Component, OnInit, Input } from '@angular/core';
import { SettingsService } from 'src/app/services/config/settings.service';
import { routes } from '../../../misc/route-list-base';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent implements OnInit {
  @Input() route: string;
  @Input() linkClass = '';
  languagePrefix: string;

  constructor(
    private settingsService: SettingsService
  ) { 
    this.languagePrefix = this.settingsService.getLanguagePrefix();
  }

  ngOnInit() {
  }

  getRoute() {
    
    return '/' + this.languagePrefix + '/' + routes[this.route][this.languagePrefix];
  }

}
