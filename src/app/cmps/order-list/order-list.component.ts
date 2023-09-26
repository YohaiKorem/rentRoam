import { Component, Input } from '@angular/core';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent {
  @Input() orders: Order[] = [];
}
