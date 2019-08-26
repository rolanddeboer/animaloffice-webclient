import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { Location } from '@angular/common';
import { RoutingToolsService } from 'src/app/services/config/routing-tools.service';
import { SettingsService } from 'src/app/services/config/settings.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @ViewChild('sidebar', {static: false}) sidebar: ElementRef;
  public dropdownActive = false;
  private justSetDropdownActive = false;
  private swipeCoordX: number;
  private swipeTime?: number;
  public sidebarDelta = 0;
  public rightMargin = 50;

  
  // @HostListener('document:click', ['$event'])
  // clickout(event) {
  //   // if the click was not on this component and not on the hamburger
  //   if(
  //     !this.eRef.nativeElement.contains(event.target) &&
  //     !event.target.classList.contains('hamburger')
  //   ) {
  //     this.settingsService.burgerState = false;
  //   }
  //   if (!this.justSetDropdownActive) {
  //     this.dropdownActive = false;
  //   }
  // }

  constructor(
    public routingTools: RoutingToolsService,
    public settingsService: SettingsService,
    private _location: Location
  ) { }

  ngOnInit() {
    if (this.routingTools.getCurrentRouteName() === 'sidebar') {
      this.rightMargin = 0;    
    }
  }
  swipe(e: TouchEvent, when: string): void {
    const coordX: number = e.changedTouches[0].pageX;
    const time = new Date().getTime(); 
    if (when === 'start') {
      this.swipeCoordX = coordX;
      this.swipeTime = time;
    } else if (when === 'end') {
      const directionX = coordX - this.swipeCoordX;
      if (
        time - this.swipeTime < 1000 // Max duration 1s
        && Math.abs(directionX) > 75 // Min distance 75px
      ) { 
        if (directionX < 0) { // negative direction is left
          this.closeSidebar();
        }
      }
      this.sidebarDelta = 0;
    }
  }
  touchmove(e: TouchEvent) {
    const directionX = e.changedTouches[0].pageX - this.swipeCoordX;
    if (directionX < 0) {
      this.sidebarDelta = Math.floor(directionX);
    } else {
      this.sidebarDelta = 0;
    }
  }
  closeSidebar() {
    if (this.routingTools.getCurrentRouteName() === 'sidebar') {
      this._location.back();
    } else {
      this.settingsService.burgerState = false;
      if (!this.justSetDropdownActive) {
        this.dropdownActive = false;
      }
    }
  }
  blinderClick() {
    this.closeSidebar();
  }
  sidebarClick() {
    if (!this.justSetDropdownActive) {
      this.dropdownActive = false;
    }
  }

  setDropdownActive() {
    this.justSetDropdownActive = true;
    this.dropdownActive = true;
    // set a timeout to play along with the global click event trapper defined above
    setTimeout(() => this.justSetDropdownActive = false, 50);
  }
  dropdownClicked() {
    // set a timeout to override the setDropdownActive function which will also get called. Is quite hackish, but is only relevant if header of dropdown is clicked.
    setTimeout(() => this.dropdownActive = false, 50);
    this.dropdownActive = false;
  }
}
