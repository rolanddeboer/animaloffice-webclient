import { Injectable, EventEmitter, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private renderer: Renderer2;
  setMargin = new EventEmitter<any>();

  constructor(
    rendererFactory: RendererFactory2
  ) { 
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  
  start(element: ElementRef, margin = '0') {
    this.setMargin.emit(margin);
    element.nativeElement.appendChild(this.getSpinnerElement());
    this.renderer.addClass(document.body, 'spinning');
  }

  stop() {
    this.renderer.removeClass(document.body, 'spinning');
    this.getContainerElement().appendChild(this.getSpinnerElement());
  }

  getSpinnerElement() {
    return document.querySelector(".spinner");
  }

  getContainerElement() {
    return document.querySelector("#spinner-container");
  }

}
