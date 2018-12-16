import { LoginPageComponent } from '../components/login/login-page/login-page.component';
import { HomepageComponent } from '../components/main/homepage/homepage.component';
import { AboutPageComponent } from '../components/pages/about-page/about-page.component';
import { PrivacyPageComponent } from '../components/pages/privacy-page/privacy-page.component';
import { DemoPageComponent } from '../components/pages/demo-page/demo-page.component';
import { TermsPageComponent } from '../components/pages/terms-page/terms-page.component';
import { routes } from './route-list-base';

export const routeList = {...routes};

routeList.login['component'] = LoginPageComponent;
routeList.contact['component'] = HomepageComponent;
routeList.about['component'] = AboutPageComponent;
routeList.demo['component'] = DemoPageComponent;
routeList.privacy['component'] = PrivacyPageComponent;
routeList.terms['component'] = TermsPageComponent;
routeList.home['component'] = HomepageComponent;
