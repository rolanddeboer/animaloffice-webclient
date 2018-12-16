import { Directive, HostListener } from '@angular/core';
  
  @Directive({
    selector: '[appNoDoubleClick]'
  })
  export class NoDoubleClickDirective {
    private lastClick = 0;

    // @HostListener('click', ['$event'])
    // clickEvent(event) {
    //   console.log("hi!");
    //   event.preventDefault();
    //   event.stopPropagation();
    //   //this.clicks.next(event);
    // }
    @HostListener('click', ['$event'])
    trapClick(event) {
      const now = Date.now();
      const ago = now - this.lastClick;
      if (ago < 500) {
        console.log("NOOOOOOOO doubleclicking!");
        event.preventDefault();
        event.stopPropagation();
      } else {
        this.lastClick = now;
      }
    }
  }