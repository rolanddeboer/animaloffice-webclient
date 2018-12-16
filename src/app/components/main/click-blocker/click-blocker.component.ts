import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-click-blocker',
  templateUrl: './click-blocker.component.html',
  styleUrls: ['./click-blocker.component.scss']
})
export class ClickBlockerComponent implements OnInit {
  lastClick = 0;

  @HostListener('document:click', ['$event'])
  trapClick(event) {
    const now = Date.now();
    const ago = now - this.lastClick;
    if (ago < 500) {
      console.log("NOOOOOOOO doubleclicking!");
    }
    this.lastClick = now;
    
    event.preventDefault();
    event.stopPropagation();
  }

  constructor() { }

  ngOnInit() {
  }

}
