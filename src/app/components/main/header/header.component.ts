import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RoutingToolsService } from 'src/app/services/config/routing-tools.service';
import { SettingsService } from 'src/app/services/config/settings.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  hoverFlag = false;

  @Output() itsburgertime = new EventEmitter<void>();

  constructor(
    private routingTools: RoutingToolsService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
  }

  getRoute(routeName: string) {
    return this.routingTools.getRouterLink(routeName);
  }

  hamfuckingburgerhasbeenfuckingclicked() {
    this.itsburgertime.emit();
  }

}

// creating flag sprite with ImageMagick: montage *.png -geometry +0+0 -tile 6x1 -background transparent flags.png