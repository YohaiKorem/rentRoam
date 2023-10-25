import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import {
  faClockRotateLeft,
  faCheck,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { TrackByService } from 'src/app/services/track-by.service';
@Component({
  selector: 'order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent {
  @Input() orders: Order[] = [];
  @Output() orderStatChanged = new EventEmitter();
  constructor(public trackByService: TrackByService) {}
  svg = {
    pending: faClockRotateLeft,
    approved: faCheck,
    declined: faTimesCircle,
  };
  onOrderStatChanged(order: Order) {
    this.orderStatChanged.emit(order);
  }
}
