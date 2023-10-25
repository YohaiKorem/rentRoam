import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import {
  faClockRotateLeft,
  faCheck,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { TrackByService } from 'src/app/services/track-by.service';
@Component({
  selector: 'trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
})
export class TripListComponent implements OnInit {
  @Input() orders: Order[] = [];
  @Output() onSelectTrip = new EventEmitter();
  constructor(public trackByService: TrackByService) {}
  currTripId!: string | null;
  svg = {
    pending: faClockRotateLeft,
    approved: faCheck,
    declined: faTimesCircle,
  };

  ngOnInit() {
    if (this.orders && this.orders.length) this.setCurrTrip(this.orders[0]);
    else this.currTripId = null;
  }

  setCurrTrip(order: Order) {
    this.currTripId = order._id;
    this.onSelectTrip.emit(order);
  }
}
