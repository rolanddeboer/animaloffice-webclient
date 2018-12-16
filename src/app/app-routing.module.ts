import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { routeList } from './misc/route-list';

let routes: Routes = [ ];
for (let route in routeList) {
  if (routeList.hasOwnProperty(route)) {
    // if ( routeList[route].en === '') {
    //   routes.push({
    //     path: '',
    //     component: routeList[route].component
    //   });
    // }
    for (let locale of ['en', 'nl']) {
      routes.push(makeRouteDef(route, locale));
    }
  }
}

function makeRouteDef(route: any, locale: string) {
  return {
    path: locale + '/' + routeList[route][locale],
    component: routeList[route].component,
    data: {
      state: route
    }
  }
}


// routes = [
//   { path: 'en/login', component: LoginPageComponent },
//   { path: 'nl/inloggen', component: LoginPageComponent },

//   { path: 'en/contact', component: HomepageContentComponent },
//   { path: 'nl/contact', component: HomepageContentComponent },

//   { path: 'en/about-animal-office', component: LoginPageComponent },
//   { path: 'nl/over-animal-office', component: LoginPageComponent },

//   { path: 'en/demo', component: HomepageContentComponent },
//   { path: 'nl/demo', component: HomepageContentComponent },

//   { path: 'en/privacy-policy', component: PrivacyPageComponent },
//   { path: 'nl/privacybeleid', component: PrivacyPageComponent },

//   { path: 'en/terms-and-conditions', component: LoginPageComponent },
//   { path: 'nl/algemene-voorwaarden', component: LoginPageComponent },

//   { path: '', component: HomepageContentComponent },
//   { path: 'en/', component: HomepageContentComponent },
//   { path: 'nl/', component: HomepageContentComponent }
// ];
// console.log(routes);


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
