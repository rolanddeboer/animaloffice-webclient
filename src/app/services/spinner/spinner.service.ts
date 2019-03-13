import { Injectable, EventEmitter, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { SpinnerComponent } from '../../components/main/spinner/spinner.component';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinnerCache = new Set<SpinnerComponent>();
  private renderer: Renderer2;
  setMargin = new EventEmitter<any>();

  constructor(
    rendererFactory: RendererFactory2
  ) { 
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  _register( spinner: SpinnerComponent ): void
  {
    this.spinnerCache.add(spinner);
  }  
  
  _unregister(spinnerToRemove: SpinnerComponent): void 
  {
    // this.spinnerCache.forEach(spinner => {
    //   if (spinner === spinnerToRemove) {
    //     this.spinnerCache.delete(spinner);
    //   }
    // });
  }

  isShowing(spinnerName: string): boolean | undefined 
  {
    let showing = undefined;
    this.spinnerCache.forEach(spinner => {
      if (spinner.name === spinnerName) {
        showing = spinner.show;
      }
    });
    return showing;
  }

  show( spinnerName: string ): void 
  {
    this.spinnerCache.forEach(spinner => {
      if (spinner.name === spinnerName) {
        spinner.show = true;
      }
    });
  }

  hide( spinnerName: string ): void 
  {
    this.spinnerCache.forEach(spinner => {
      if (spinner.name === spinnerName) {
        spinner.show = false;
      }
    });
  }

  showGroup( spinnerGroup: string ): void 
  {
    this.spinnerCache.forEach(spinner => {
      if (spinner.group === spinnerGroup) {
        spinner.show = true;
      }
    });
  }

  hideGroup( spinnerGroup: string ): void 
  {
    this.spinnerCache.forEach(spinner => {
      if (spinner.group === spinnerGroup) {
        spinner.show = false;
      }
    });
  }

  showAll(): void 
  {
    this.spinnerCache.forEach(spinner => spinner.show = true);
  }

  hideAll(): void 
  {
    this.spinnerCache.forEach(spinner => spinner.show = false);
  }

  markBody(): void
  {
    this.renderer.addClass(document.body, 'spinning');
  }

}


