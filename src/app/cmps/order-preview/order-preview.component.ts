import { Component, Input } from '@angular/core';
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
  isImgLoaded: boolean = false;
  isImgErr: boolean = false;
  faClockRotateLeft = faClockRotateLeft;
  faCheck = faCheck;
  faTimesCircle = faTimesCircle;

  onImgErr() {
    this.isImgLoaded = false;
    this.isImgErr = true;
  }

  getStatusIcon(status: string) {
    if (status === 'pending') return this.faClockRotateLeft;
    if (status === 'approved') return this.faCheck;
    else return this.faTimesCircle;
  }
}
