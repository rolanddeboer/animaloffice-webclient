import { Component, ElementRef, ViewChild } from '@angular/core';
import { routerTransition } from './misc/router-animations';
import { RoutingToolsService } from './services/config/routing-tools.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsService } from './services/config/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ routerTransition ]
})
export class AppComponent {  
  @ViewChild('logoutModal', {static: false}) logoutModal: ElementRef;

  constructor(
    private routingTools: RoutingToolsService,
    private modalService: NgbModal,
    public settingsService: SettingsService
  ) {
    this.settingsService.logoutOccured.subscribe(() => {
      this.modalService.open(this.logoutModal, {centered: true});
    });
  }

  isFullScreen(): boolean {
    return this.routingTools.isFullScreen();
  }

  getFooterTheme() {
    return this.routingTools.getCurrentRouteName() === 'home' ? 'light' : 'dark';
  }

  getState(outlet) {
      return outlet.activatedRouteData.state;
  }

}
