import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPageComponent } from './components/login/login-page/login-page.component';
import { HomepageComponent } from './components/main/homepage/homepage.component';
import { AboutPageNlComponent } from './components/pages/about-page/about-page-nl.component';
import { AboutPageEnComponent } from './components/pages/about-page/about-page-en.component';
import { PrivacyPageNlComponent } from './components/pages/privacy-page/privacy-page-nl.component';
import { PrivacyPageEnComponent } from './components/pages/privacy-page/privacy-page-en.component';
import { DemoPageNlComponent } from './components/pages/demo-page/demo-page-nl.component';
import { DemoPageEnComponent } from './components/pages/demo-page/demo-page-en.component';
import { TermsPageNlComponent } from './components/pages/terms-page/terms-page-nl.component';
import { TermsPageEnComponent } from './components/pages/terms-page/terms-page-en.component';
import { PageNotFoundComponent } from './components/main/page-not-found/page-not-found.component';
import { ContactComponent } from './components/main/contact/contact.component';
import { PersonalDetailsComponent } from './components/main/personal-details/personal-details.component';
import { ShowComponent } from './components/show/show/show.component';
import { ListAllShowsComponent } from './components/show/list-all-shows/list-all-shows.component';
import { EntryFormComponent } from './components/show/entry-form/entry-form.component';
import { StatisticsComponent } from './components/show/statistics/statistics.component';

const routes: Routes = [
  { path: 'en/:region/home', component: HomepageComponent, data: {state: 'home'} },
  { path: 'nl/:region/hoofdpagina', component: HomepageComponent, data: {state: 'home'} },
  { path: 'en/:region/login', component: LoginPageComponent, data: {state: 'login'} },
  { path: 'nl/:region/inloggen', component: LoginPageComponent, data: {state: 'login'} },
  { path: 'en/:showOverallSlug/:showEditionSlug/login', component: LoginPageComponent, data: {state: 'login'} },
  { path: 'nl/:showOverallSlug/:showEditionSlug/inloggen', component: LoginPageComponent, data: {state: 'login'} },
  { path: 'en/:region/about-animal-office', component: AboutPageEnComponent, data: {state: 'about'} },
  { path: 'nl/:region/over-animal-office', component: AboutPageNlComponent, data: {state: 'about'} },
  { path: 'en/:region/demo', component: DemoPageEnComponent, data: {state: 'demo'} },
  { path: 'nl/:region/demo', component: DemoPageNlComponent, data: {state: 'demo'} },
  { path: 'en/:region/privacy-policy', component: PrivacyPageEnComponent, data: {state: 'privacy'} },
  { path: 'nl/:region/privacybeleid', component: PrivacyPageNlComponent, data: {state: 'privacy'} },
  { path: 'en/:region/terms-and-conditions', component: TermsPageEnComponent, data: {state: 'terms'} },
  { path: 'nl/:region/algemene-voorwaarden', component: TermsPageNlComponent, data: {state: 'terms'} },
  { path: 'en/:region/contact', component: ContactComponent, data: {state: 'contact'} },
  { path: 'nl/:region/contact', component: ContactComponent, data: {state: 'contact'} },
  { path: 'en/:region/personal-details', component: PersonalDetailsComponent, data: {state: 'person'} },
  { path: 'nl/:region/persoonsgegevens', component: PersonalDetailsComponent, data: {state: 'person'} },
  { path: 'en/:region/shows', component: ListAllShowsComponent, data: {state: 'shows'} },
  { path: 'nl/:region/shows', component: ListAllShowsComponent, data: {state: 'shows'} },

  { path: 'en/:showOverallSlug/:showEditionSlug/personal-details', component: PersonalDetailsComponent, data: {state: 'person'}  },
  { path: 'en/:showOverallSlug/:showEditionSlug/signup', component: EntryFormComponent, data: {state: 'entryform'}  },
  { path: 'en/:showOverallSlug/:showEditionSlug/statistics', component: StatisticsComponent, data: {state: 'person'}  },
  { path: 'en/:showOverallSlug', component: ShowComponent, data: {state: 'show'}  },
  
  { path: '**', component: PageNotFoundComponent, data: {state: 'notfound'}  }
];

// routeList.login['component'] = LoginPageComponent;
// routeList.home['component'] = HomepageComponent;
// routeList.about['component'] = AboutPageComponent;
// routeList.demo['component'] = DemoPageComponent;
// routeList.privacy['component'] = PrivacyPageComponent;
// routeList.terms['component'] = TermsPageComponent;

// const routes: Routes = [ ];
// for (let route in routeList) {
//   if (routeList.hasOwnProperty(route)) {
//     for (let locale of ['en', 'nl']) {
//       routes.push(makeRouteDef(route, locale));
//     }
//   }
// }

// function makeRouteDef(route: any, locale: string) {
//   return {
//     path: locale + '/' + routeList[route][locale],
//     component: routeList[route].component
//   }
// }


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
