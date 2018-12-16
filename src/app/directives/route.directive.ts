import { Directive, OnInit, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { routes } from '../misc/route-list-base';
import { SettingsService } from '../services/config/settings.service';

@Directive({
  selector: '[appRoute]'
})
export class RouteDirective implements OnInit {

  constructor(
    private renderer: Renderer2, 
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef
  ) { 
    this.renderer.setAttribute(this.elementRef.nativeElement, 'routerLink', "en/contact");
    console.log(this.elementRef.nativeElement.getAttribute('appRoute'));
    console.log(this.elementRef.nativeElement);
    //this.changeDetectorRef.detectChanges();
  }

  ngOnInit() {
    // this.elementRef.nativeElement.appRoute;
  }

}
