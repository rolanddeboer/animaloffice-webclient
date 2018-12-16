import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/main/header/header.component';

import {NgbButtonsModule, NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import { HomepageComponent } from './components/main/homepage/homepage.component';
import { FooterComponent } from './components/main/footer/footer.component';
import { HomepageBoxComponent } from './components/main/homepage-box/homepage-box.component';
import { LoginPageComponent } from './components/login/login-page/login-page.component';
import { PrivacyPageComponent } from './components/pages/privacy-page/privacy-page.component';
import { TermsPageComponent } from './components/pages/terms-page/terms-page.component';
import { AboutPageComponent } from './components/pages/about-page/about-page.component';
import { DemoPageComponent } from './components/pages/demo-page/demo-page.component';

import { RouteDirective } from './directives/route.directive';
import { SidebarComponent } from './components/main/sidebar/sidebar.component';
import { LinkComponent } from './components/main/link/link.component';
import { ClickBlockerComponent } from './components/main/click-blocker/click-blocker.component';
import { NoDoubleClickDirective } from './directives/no-double-click.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpinnerComponent } from './components/main/spinner/spinner.component';
import { LoginListComponent } from './components/login/login-list/login-list.component';
import { LoginNumberInputComponent } from './components/login/login-number-input/login-number-input.component';
import { LoginHeaderComponent } from './components/login/login-header/login-header.component';
import { LoginNameCheckerComponent } from './components/login/login-name-checker/login-name-checker.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { LoginNotMeComponent } from './components/login/login-not-me/login-not-me.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomepageComponent,
    FooterComponent,
    HomepageBoxComponent,
    LoginPageComponent,
    PrivacyPageComponent,
    TermsPageComponent,
    AboutPageComponent,
    DemoPageComponent,
    RouteDirective,
    SidebarComponent,
    LinkComponent,
    ClickBlockerComponent,
    NoDoubleClickDirective,
    SpinnerComponent,
    LoginListComponent,
    LoginNumberInputComponent,
    LoginHeaderComponent,
    LoginNameCheckerComponent,
    AutofocusDirective,
    LoginNotMeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbButtonsModule, NgbDropdownModule, NgbTooltipModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
