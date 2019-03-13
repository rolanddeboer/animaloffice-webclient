import { Component, OnInit } from '@angular/core';
import { RoutingToolsService } from 'src/app/services/config/routing-tools.service';

@Component({
  selector: 'app-language-chooser',
  templateUrl: './language-chooser.component.html',
  styleUrls: ['./language-chooser.component.scss']
})
export class LanguageChooserComponent implements OnInit {

  constructor(
    public routingTools: RoutingToolsService,
  ) { }

  ngOnInit() {
  }

}
