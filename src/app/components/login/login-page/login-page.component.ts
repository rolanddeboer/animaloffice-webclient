import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Show, ShowOverall } from 'src/app/classes/initData';
import { LoginService } from 'src/app/services/login/login.service';
// import { ShowService } from 'src/app/services/show/show.service';
import { SettingsService } from 'src/app/services/config/settings.service';
import { DatabaseService } from 'src/app/services/database/database.service';
import { RoutingToolsService } from 'src/app/services/config/routing-tools.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(
    public loginService: LoginService,
    private route: ActivatedRoute,
    // private showService: ShowService,
    public settings: SettingsService,
    public db: DatabaseService,
    private routingTools: RoutingToolsService,
  ) { }

  ngOnInit()
  {
    //this.loginService.inModal = true;
    this.settings.whenInitialized.then(
      () => {
        if (this.settings.person) {
          this.routingTools.navigateToRoute( "home" );
        }
        this.loginService.inModal = false;
        this.loginService.reset();
        this.setShow();
      }
    );
  }

  setShow(): void
  {
    // if ( !this.db.has("ShowOverall") ) {
    //   setTimeout( () => this.setShow(), 50);
    //   return;
    // }

    this.route.params.subscribe( params => {
      this.db.findWhen(
        "ShowOverall", 
        params["showOverallSlug"], 
        "slug"
      ).then( (showOverall: any) => {
        if (! showOverall ) return;
        for ( let showItem of showOverall.shows ) {
          if ( showItem.editionSlug == params["showEditionSlug"] ) {
            this.settings.activeShow = showItem;
            break;
          }
        }
      });
    });
  }

}
