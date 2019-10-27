import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-terms-page-en',
  templateUrl: './terms-page-en.component.html',
  styleUrls: ['./terms-page.component.scss']
})
export class TermsPageEnComponent implements OnInit {
  @Input() inModal = true;

  constructor() { }

  ngOnInit() {
    // document.querySelector('.top').scrollIntoView(true);
  }

}
