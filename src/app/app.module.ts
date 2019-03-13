import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/main/header/header.component';

import {NgbButtonsModule, NgbDropdownModule, NgbTooltipModule, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';

import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';

import { HomepageComponent } from './components/main/homepage/homepage.component';
import { FooterComponent } from './components/main/footer/footer.component';
import { HomepageBoxComponent } from './components/main/homepage-box/homepage-box.component';
import { LoginPageComponent } from './components/login/login-page/login-page.component';
import { PrivacyPageNlComponent } from './components/pages/privacy-page/privacy-page-nl.component';

import { RouteDirective } from './directives/route.directive';
import { SidebarComponent } from './components/main/sidebar/sidebar.component';
import { LinkComponent } from './components/main/link/link.component';
import { NoDoubleClickDirective } from './directives/no-double-click.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpinnerComponent } from './components/main/spinner/spinner.component';
import { LoginListComponent } from './components/login/login-list/login-list.component';
import { LoginNumberInputComponent } from './components/login/login-number-input/login-number-input.component';
import { LoginHeaderComponent } from './components/login/login-header/login-header.component';
import { LoginNameCheckerComponent } from './components/login/login-name-checker/login-name-checker.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { LoginNotMeComponent } from './components/login/login-not-me/login-not-me.component';
import { PageNotFoundComponent } from './components/main/page-not-found/page-not-found.component';
import { ContactComponent } from './components/main/contact/contact.component';
import { LanguageChooserComponent } from './components/main/language-chooser/language-chooser.component';
import { DemoPageNlComponent } from './components/pages/demo-page/demo-page-nl.component';
import { DemoPageEnComponent } from './components/pages/demo-page/demo-page-en.component';
import { AboutPageNlComponent } from './components/pages/about-page/about-page-nl.component';
import { AboutPageEnComponent } from './components/pages/about-page/about-page-en.component';
import { TermsPageNlComponent } from './components/pages/terms-page/terms-page-nl.component';
import { TermsPageEnComponent } from './components/pages/terms-page/terms-page-en.component';
import { PrivacyPageEnComponent } from './components/pages/privacy-page/privacy-page-en.component';
import { PersonalDetailsComponent } from './components/main/personal-details/personal-details.component';
import { ShowListComponent } from './components/show/show-list/show-list.component';
import { ShowComponent } from './components/show/show/show.component';
import { EntryFormComponent } from './components/show/entry-form/entry-form.component';
import { StatisticsComponent } from './components/show/statistics/statistics.component';
import { ListShowsComponent } from './components/show/list-shows/list-shows.component';
import { ListAllShowsComponent } from './components/show/list-all-shows/list-all-shows.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomepageComponent,
    FooterComponent,
    HomepageBoxComponent,
    LoginPageComponent,
    RouteDirective,
    SidebarComponent,
    LinkComponent,
    NoDoubleClickDirective,
    SpinnerComponent,
    LoginListComponent,
    LoginNumberInputComponent,
    LoginHeaderComponent,
    LoginNameCheckerComponent,
    AutofocusDirective,
    LoginNotMeComponent,
    PageNotFoundComponent,
    ContactComponent,
    LanguageChooserComponent,
    DemoPageNlComponent,
    DemoPageEnComponent,
    AboutPageNlComponent,
    AboutPageEnComponent,
    TermsPageNlComponent,
    TermsPageEnComponent,
    PrivacyPageNlComponent,
    PrivacyPageEnComponent,
    PersonalDetailsComponent,
    ShowListComponent,
    ShowComponent,
    EntryFormComponent,
    StatisticsComponent,
    ListShowsComponent,
    ListAllShowsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbButtonsModule, NgbDropdownModule, NgbTooltipModule, NgbModalModule,
    JwBootstrapSwitchNg2Module,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
