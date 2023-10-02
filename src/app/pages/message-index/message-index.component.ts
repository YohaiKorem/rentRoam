import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, tap, map, forkJoin, take } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'message-index',
  templateUrl: './message-index.component.html',
  styleUrls: ['./message-index.component.scss'],
})
export class MessageIndexComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private usererService: UserService
  ) {}
  user$!: Observable<User>;
  user!: User;
  orders$!: Observable<Order[]>;
  orders: Order[] = [];
  currChat!: Order;
  ngOnInit(): void {
    this.usererService.loggedInUser$.pipe(take(1)).subscribe((user) => {
      this.user = user!;
      const userHostOrders$ = this.orderService.getOrdersForEntityById(
        this.user._id,
        'host'
      );
      const userGuestOrders$ = this.orderService.getOrdersForEntityById(
        this.user._id,
        'guest'
      );
      this.orders$ = forkJoin([userGuestOrders$, userHostOrders$]).pipe(
        map(([guestOrders, hostOrders]) => [...guestOrders, ...hostOrders])
      );
      this.orders$.pipe(take(1)).subscribe((orders) => {
        this.orders = orders;
        this.setCurrChat(orders[0]._id);
      });
      console.log(this.orders);
    });
  }

  setCurrChat(orderId: string) {
    const currChat = this.orders.find((order) => orderId === order._id);
    if (currChat) this.currChat = currChat;
  }
}
