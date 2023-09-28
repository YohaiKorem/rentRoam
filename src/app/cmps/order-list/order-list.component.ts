import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent {
  @Input() orders: Order[] = [];
  @Output() orderStatChanged = new EventEmitter();

  onOrderStatChanged(order: Order) {
    this.orderStatChanged.emit(order);
  }
}
