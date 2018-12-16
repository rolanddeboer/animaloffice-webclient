import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() theme;

  constructor(
  ) { 
  }

  ngOnInit() {
    // console.log(this.routingTools.getCurrentRoute());
    // console.log(this.router.url);
  }

}
