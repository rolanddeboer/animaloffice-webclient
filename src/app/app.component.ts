import { Component } from '@angular/core';
import { routerTransition } from './misc/router-animations';
import { RoutingToolsService } from './services/config/routing-tools.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ routerTransition ]
})
export class AppComponent {  
  burgerState = false;

  constructor(
    private routingTools: RoutingToolsService
  ) {}

  isFullScreen(): boolean {
    return this.routingTools.isFullScreen();
  }

  getFooterTheme() {
    return this.routingTools.getCurrentRouteName() === 'home' ? 'light' : 'dark';
  }

  getState(outlet) {
      return outlet.activatedRouteData.state;
  }

  hamfuckingburgerhasapperantlyfuckingbeenclicked(forceClose: boolean = false) {
    if (forceClose) {
      this.burgerState = false;
    } else {
      this.burgerState = !this.burgerState;
    }
  }
}
