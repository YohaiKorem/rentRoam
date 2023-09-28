import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import {
  faClockRotateLeft,
  faCheck,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'order-preview',
  templateUrl: './order-preview.component.html',
  styleUrls: ['./order-preview.component.scss'],
})
export class OrderPreviewComponent implements OnInit {
  @Input() order!: Order;
  @Output() orderStatChanged = new EventEmitter();
  isImgLoaded: boolean = false;
  isImgErr: boolean = false;
  faClockRotateLeft = faClockRotateLeft;
  faCheck = faCheck;
  faTimesCircle = faTimesCircle;
  status: string = '';
  orderDateForDisplay!: string;

  ngOnInit() {
    this.orderDateForDisplay = this.getOrderDateForDisplay();
  }

  onImgErr() {
    this.isImgLoaded = false;
    this.isImgErr = true;
  }

  getStatusIcon(status: string) {
    if (status === 'pending') return this.faClockRotateLeft;
    if (status === 'approved') return this.faCheck;
    else return this.faTimesCircle;
  }
  onStatusChanged(ev: Event) {
    const updatedOrder = JSON.parse(JSON.stringify(this.order));
    updatedOrder.status = this.status;
    this.order = updatedOrder;
    this.orderStatChanged.emit(updatedOrder);
  }
  getOrderDateForDisplay() {
    return new Date(this.order.checkin).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
