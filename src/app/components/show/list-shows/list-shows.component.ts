import { Component, OnInit, Input } from '@angular/core';
import { SettingsService } from 'src/app/services/config/settings.service';
import { ShowStatus, Show, ShowOverall } from 'src/app/classes/initData';
import { DatabaseService } from 'src/app/services/database/database.service';

@Component({
  selector: 'app-list-shows',
  templateUrl: './list-shows.component.html',
  styleUrls: ['./list-shows.component.scss']
})
export class ListShowsComponent implements OnInit {
  public _showOveralls: Object;
  public displayInactiveShows = false;
  @Input() showOverall: ShowOverall;

  constructor(
    public settings: SettingsService,
    private db: DatabaseService
  ) { }

  ngOnInit() {
  }

  get showOveralls(): Object
  {
    if ( !this._showOveralls && this.db.get("ShowStatus").length ) {
      const visibilities = {};
      for ( let showStatus of this.db.get("ShowStatus") ) {
        visibilities[ showStatus.slug ] = !showStatus.hide;
      }

      const showOveralls = {};
      for ( let showOverall of this.db.get("ShowOverall") ) {
        showOveralls[showOverall.id] = {"visibility": {...visibilities} };
      }
      this._showOveralls = showOveralls;
    }
    
    return this._showOveralls;
  }

  formatDate( date: Date ) {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric"
    }
    return date.toLocaleDateString( this.settings.localeId, options );
  }

  displayDisplayMoreButton( showOverallId: number ): boolean
  {
    if (
      this.isStatusVisible( showOverallId, "future" )
      && this.isStatusVisible( showOverallId, "history" )
    ) {
      return false;
    }
    let displayIt = false;
    for ( let show of this.db.find("ShowOverall", showOverallId).shows ) {
      if ( 
        show.showStatus.slug == "future" 
        || show.showStatus.slug == "history"
      ) {
        displayIt = true;
        break;
      }
    }
    return displayIt;
  }

  displayStatisticsButton( showId: number ): boolean
  {
    return ( 
      this.db.find("Show", showId).showStatus.slug != "coming-up"
      && this.db.find("Show", showId).showStatus.slug != "future"
    );
  }

  displaySignUpButton( showId: number ): boolean
  {
    return ( 
      this.db.find("Show", showId).showStatus.slug == "entry-open"
    );
  }

  showOlderShows( showOverallId: number ): void
  {
    this.toggleStatusVisibility( showOverallId, "future" );
    this.toggleStatusVisibility( showOverallId, "history" );
  }

  toggleStatusVisibility( showOverallId: number, showStatus: string ): void
  {
    this.showOveralls[ showOverallId ]["visibility"][ showStatus ] 
    = 
    !this.showOveralls[ showOverallId ]["visibility"][ showStatus ]
  }

  isStatusVisible( showOverallId: number, showStatus: string ): boolean
  {
    return this.showOveralls[ showOverallId ]["visibility"][ showStatus ];
  }
}
