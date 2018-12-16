import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-homepage-box',
  templateUrl: './homepage-box.component.html',
  styleUrls: ['./homepage-box.component.scss']
})
export class HomepageBoxComponent implements OnInit {
  @Input() position: string;

  constructor() { }

  ngOnInit() {
  }

}
