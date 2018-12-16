import { Component, OnInit, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Output() itsburgertime = new EventEmitter<boolean>();
  
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(
      !this.eRef.nativeElement.contains(event.target) &&
      !event.target.classList.contains('hamfuckingburger')
    ) {
      this.hamfuckingbackburgerhasbeenfuckingclicked();
    }
  }

  constructor(
    private eRef: ElementRef
  ) { }

  ngOnInit() {
  }
  linkClicked() {
    this.itsburgertime.emit(true);

  }
  hamfuckingbackburgerhasbeenfuckingclicked() {
    this.itsburgertime.emit(false);
  }
}
