import { Component, OnInit } from '@angular/core';
import { ShowOverall } from 'src/app/classes/initData';
import { DatabaseService } from 'src/app/services/database/database.service';

@Component({
  selector: 'app-list-all-shows',
  templateUrl: './list-all-shows.component.html',
  styleUrls: ['./list-all-shows.component.scss']
})
export class ListAllShowsComponent implements OnInit {
  public displayInactiveShows = false;

  constructor(
    private db: DatabaseService
  ) { }

  ngOnInit() {
  }

  displayShowOverall( showOverall: ShowOverall ): boolean
  {
    if ( this.displayInactiveShows ) return true;

    let display = false;
    for ( let show of showOverall.shows ) {
      if ( !show.showStatus.hide ) display = true;
    }
    return display;
  }

}
