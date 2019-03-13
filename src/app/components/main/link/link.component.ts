import { Component, OnInit, Input } from '@angular/core';
import { RoutingToolsService } from 'src/app/services/config/routing-tools.service';
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
    private routingTools: RoutingToolsService
  ) { 
  }

  ngOnInit() {
  }

  getRoute() {
    return this.routingTools.getRouterLink(this.route)
  }

}
