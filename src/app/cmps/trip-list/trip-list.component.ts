import { Component, Input } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import {
  faClockRotateLeft,
  faCheck,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
})
export class TripListComponent {
  @Input() orders: Order[] = [];
  svg = {
    pending: faClockRotateLeft,
    approved: faCheck,
    declined: faTimesCircle,
  };
}
