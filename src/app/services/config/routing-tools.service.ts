import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { SettingsService } from './settings.service';
import { routes } from '../../misc/route-list-base';

@Injectable({
  providedIn: 'root'
})
export class RoutingToolsService {
  private languagePrefix: string;
  private currentUrl: string;
  private currentRouteName: string;

  constructor(
    @Inject(LOCALE_ID) protected localeId: string,
    private router: Router,
    private settingsService: SettingsService
  ) { 
    this.languagePrefix = this.settingsService.getLanguagePrefix();
    router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        if (event.url != this.currentUrl) {
          this.currentUrl = event.url;
          this.currentRouteName = this.getRouteName(this.currentUrl);
          // scrolling to the top of the page, because that is what should happen when a link is clicked. Unfortunately this does not allow for remembering page location for previous pages. Check back later whether Angular has implemented this properly (last checked for 7).
          window.scrollTo(0, 0);
          if (event.url === '/') {
            router.navigateByUrl('/' + this.languagePrefix + '/home');
          }
        }
      }
    });
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
    url = url.replace('/' + this.languagePrefix + '/', '');
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

  navigateToRoute(name: string) {
    this.router.navigate([this.getRouterLink(name)]);
  }

  getRouterLink(name: string) {
    return this.languagePrefix + '/' + routes[name][this.languagePrefix];
  }
  getCurrentRoute() {
    // this.router.events.subscribe((url:any) => console.log(url));
    return this.router.url;
  }

}
