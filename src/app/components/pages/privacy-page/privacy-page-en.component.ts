import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-privacy-page-en',
  templateUrl: './privacy-page-en.component.html',
  styleUrls: ['./privacy-page.component.scss']
})
export class PrivacyPageEnComponent implements OnInit {
  @Input() inModal = true;

  constructor() { }

  ngOnInit() {
  }

}
