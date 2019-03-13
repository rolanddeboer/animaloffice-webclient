import { Component, OnInit  } from '@angular/core';
import { RoutingToolsService } from 'src/app/services/config/routing-tools.service';
import { SettingsService } from 'src/app/services/config/settings.service';
import { ShowService } from 'src/app/services/show/show.service';

class ShowType
{
  name: string;
  edition: string;
  logoFile: string;
  isPortrait: boolean;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  hoverFlag = false;
  show: ShowType;
  showSubscription;

  constructor(
    public routingTools: RoutingToolsService,
    public settingsService: SettingsService,
    public showService: ShowService
  ) { }

  ngOnInit() 
  {
    const that = this;
    this.showSubscription = this.showService.getShow().subscribe({
      next (data: any): void {
        that.show = data;
      }
    })
  }

  getRoute(routeName: string) 
  {
    return this.routingTools.getRouterLink(routeName);
  }

  burgerClicked() 
  {
    this.settingsService.burgerState = !this.settingsService.burgerState;
  }

  ngOnDestroy()
  {
    this.showSubscription.unsubscribe();
  }

}

// creating flag sprite with ImageMagick: montage *.png -geometry +0+0 -tile 6x1 -background transparent flags.png