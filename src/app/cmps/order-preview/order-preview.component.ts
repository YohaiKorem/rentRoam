import { Component, Input, Output, EventEmitter } from '@angular/core';
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
export class OrderPreviewComponent {
  @Input() order!: Order;
  @Output() orderStatChanged = new EventEmitter();
  isImgLoaded: boolean = false;
  isImgErr: boolean = false;
  faClockRotateLeft = faClockRotateLeft;
  faCheck = faCheck;
  faTimesCircle = faTimesCircle;
  status: string = '';
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
}
