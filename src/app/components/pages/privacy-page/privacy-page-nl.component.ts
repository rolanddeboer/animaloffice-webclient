import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy-page-nl',
  templateUrl: './privacy-page-nl.component.html',
  styleUrls: ['./privacy-page.component.scss']
})
export class PrivacyPageNlComponent implements OnInit {
  @Input() inModal = true;

  constructor() { }

  ngOnInit() {
  }

}
