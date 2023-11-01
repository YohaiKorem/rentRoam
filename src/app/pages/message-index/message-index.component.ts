import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, tap, map, forkJoin, take } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { OrderService } from 'src/app/services/order.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'message-index',
  templateUrl: './message-index.component.html',
  styleUrls: ['./message-index.component.scss'],
})
export class MessageIndexComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private usererService: UserService,
    private sharedService: SharedService
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
    });
    this.sharedService.hideElementOnMobile('.main-header');
  }

  updateCurrChat(order: Order) {
    this.currChat = order;
    this.updateOrderInOrders(order);
  }

  updateOrderInOrders(order: Order) {
    const idx = this.orders.findIndex((o) => o._id === order._id);
    this.orders.splice(idx, 1, order);
  }

  setCurrChat(orderId: string) {
    const currChat = this.orders.find((order) => orderId === order._id);
    if (currChat) this.currChat = currChat;
  }

  navToChat(orderId: string) {
    this.router.navigateByUrl(`/messages/${this.user._id}/${orderId}`);
  }

  ngOnDestroy() {
    this.sharedService.showElementOnMobile('.main-header');
  }
}
