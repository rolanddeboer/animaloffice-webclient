import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-terms-page-nl',
  templateUrl: './terms-page-nl.component.html',
  styleUrls: ['./terms-page.component.scss']
})
export class TermsPageNlComponent implements OnInit {
  @Input() inModal = true;

  constructor() { }

  ngOnInit() {
  }

}
