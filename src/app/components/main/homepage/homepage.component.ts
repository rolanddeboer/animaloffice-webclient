import { Component, OnInit, HostListener } from '@angular/core';
import { SettingsService } from 'src/app/services/config/settings.service';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  // backgroundImage: any;
  // portrait = false;
  backgroundNumberWide = this.settingsService.getBackgroundNumberWide();
  backgroundNumberSquare = this.settingsService.getBackgroundNumberSquare();
  // backgroundImageWide = '/assets/images/homepage-backgrounds/wide/animaloffice' + this.backgroundNumberWide + '.jpg';
  // backgroundImageSquare = '/assets/images/homepage-backgrounds/square/animaloffice0' + this.backgroundNumberSquare + '.jpg';

  // @HostListener('window:resize', ['$event'])onResize(event) {
  //   this.checkOrientation();
  // }

  constructor(
    private settingsService: SettingsService
  ) {
    // doing this here and not in init because we want to put the browser to work downloading the image as soon as possible when initializing the app.
    // this.setBackgroundImage();
    this.settingsService.themeUpdated.emit('light');
  }

  ngOnInit() {}

  // checkOrientation() {
  //   if (this.portrait != window.matchMedia( "(orientation: portrait)" ).matches) {
  //     this.portrait = !this.portrait;
  //     this.setBackgroundImage();
  //   }
  // }

  // setBackgroundImage() {
  //   console.log("hi! " + this.portrait);
  //   if (this.portrait) {
  //     this.backgroundImage = {
  //       src: this.backgroundImageSquare,
  //       width: "1000px",
  //       height: "1000px"
  //     }
  //   } else {
  //     this.backgroundImage = {
  //       src: this.backgroundImageWide,
  //       width: "1200px",
  //       height: "400px"
  //     }
  //   }
  //   console.log(this.backgroundImage);
  // }

}
