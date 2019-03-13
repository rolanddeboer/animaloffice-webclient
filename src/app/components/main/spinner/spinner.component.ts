import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit, OnDestroy {
  @Input() name: string;
  @Input() group: string;
  @Input() blinder = false;
  // public show = true;

  private isShowing = false;

  @Input()
  get show(): boolean {
    return this.isShowing;
  }

  @Output() showChange = new EventEmitter();

  set show(val: boolean) 
  {
    this.isShowing = val;
    this.showChange.emit(this.isShowing);
  }

  constructor(
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void 
  { 
    if (!this.name) {
      this.isShowing = true;
    } else {
      this.spinnerService._register(this);
    }
  }

  ngOnDestroy(): void 
  {
    this.spinnerService._unregister(this);
  }

}
