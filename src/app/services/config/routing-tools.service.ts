import { Injectable, LOCALE_ID, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { SettingsService } from './settings.service';
import { routes } from '../../misc/route-list-base';

@Injectable({
  providedIn: 'root'
})
export class RoutingToolsService {
  public languagePrefix: string;
  public region: string;
  private currentUrl: string;
  private currentRouteName: string;
  // private renderer: Renderer2;

  constructor(
    @Inject(LOCALE_ID) protected localeId: string,
    private router: Router,
    private settingsService: SettingsService,
    rendererFactory: RendererFactory2,
    private route: ActivatedRoute
  ) { 
    // this.renderer = rendererFactory.createRenderer(null, null);
    this.languagePrefix = this.settingsService.getLanguagePrefix();
    this.region = "nl";
    router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        if (event.url != this.currentUrl) {
          this.currentUrl = event.url;
          this.currentRouteName = this.getRouteName(this.currentUrl);
          // if ( this.currentRouteName == "person" ) {
          //   this.navigateToRoute( "login" );
          // }
          const classList = document.querySelector('body').classList.contains('touch') ? 'touch ' : '';
          document.querySelector('body').className = classList + 'page-' + this.currentRouteName;
          // if (this.currentRouteName === 'login') {
          //   this.renderer.addClass(document.body, 'gray-background');
          // } else {
          //   this.renderer.removeClass(document.body, 'gray-background');
          // }
          // scrolling to the top of the page, because that is what should happen when a link is clicked. Unfortunately this does not allow for remembering page location for previous pages. Check back later whether Angular has implemented this properly (last checked for 7).
          window.scrollTo(0, 0);
          if (
            event.url === '/' || 
            event.url === '/nl' || 
            event.url === '/en' || 
            event.url === '/nl/' || 
            event.url === '/en/'
          ) {
            this.router.navigate( ["en/nl/home"] );
            // this.navigateToRoute('home');
          }
          this.settingsService.burgerState = false;
          this.settingsService.activeShow = null;
        }
      }
    });
  }

  changeLanguage(locale: string) {
    if (this.languagePrefix !== locale && ['en', 'nl'].includes(locale)) {
      document.getElementById("spinner-blinder").style.display = "block";
      const routeName = this.getCurrentRouteName();
      const location = locale + '/' + routes[routeName][locale];
      (window as any).location = location;
    }
  }
  swapLanguage() {
    console.log(this.getCurrentRouteName());
    const newLocale = (this.languagePrefix === 'en') ? 'nl' : 'en';
    this.changeLanguage(newLocale);
  }

  isFullScreen(): boolean {
    const route = routes[this.getCurrentRouteName()];
    if (!route) {
      return false;
    }
    return 'fullScreen' in route && route.fullScreen;
  }

  getCurrentRouteName(): string {
    if (!this.currentRouteName) {
      this.currentRouteName = this.getRouteName(this.router.url);
    }
    return this.currentRouteName;
  }

  getRouteName(url: string) {
    url = url.replace('/' + this.languagePrefix + '/' + this.region + '/', '');
    for (let route in routes) {
      if (
        routes.hasOwnProperty(route) && 
        this.languagePrefix in routes[route] &&
        routes[route][this.languagePrefix]===url
      ) {
        return route;
      }
    }
    return '';
  }

  navigateToRoute(name: string): void
  {
    this.router.navigate([this.getRouterLink(name)]);
  }

  getRouterLink(name: string): string
  {
    return '/' + this.languagePrefix + '/' + this.region + '/' + routes[name][this.languagePrefix];
  }

  getCurrentRoute(): string
  {
    // this.router.events.subscribe((url:any) => console.log(url));
    return this.router.url;
  }

}
