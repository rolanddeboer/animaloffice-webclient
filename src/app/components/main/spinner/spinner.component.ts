import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  margin = '0';

  constructor(
    private spinner: SpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.setMargin.subscribe((margin: string) => {
      this.margin = margin;
    });
  }

}
