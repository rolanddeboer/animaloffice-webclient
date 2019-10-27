import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RoutingToolsService } from 'src/app/services/config/routing-tools.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() page: string;

  constructor(
    public activeModal: NgbActiveModal,
    public routingTools: RoutingToolsService
  ) { }

  ngOnInit() {
  }

}
