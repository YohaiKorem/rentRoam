import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Observable,
  switchMap,
  map,
  forkJoin,
  takeUntil,
  combineLatest,
  debounceTime,
} from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { OrderService } from 'src/app/services/order.service';
import { SharedService } from 'src/app/services/shared.service';
import { SocketService } from 'src/app/services/socket.service';
import { Unsub } from 'src/app/services/unsub.class';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'message-index',
  templateUrl: './message-index.component.html',
  styleUrls: ['./message-index.component.scss'],
})
export class MessageIndexComponent extends Unsub implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private orderService: OrderService,
    private usererService: UserService,
    private sharedService: SharedService,
    private socketService: SocketService
  ) {
    super();
  }
  user$!: Observable<User>;
  user!: User;
  orders$!: Observable<Order[]>;
  orders: Order[] = [];
  currChat!: Order;
  ngOnInit(): void {
    this.usererService.loggedInUser$
      .pipe(
        debounceTime(500),
        takeUntil(this.unsubscribe$),
        switchMap((user) => {
          this.user = user!;
          return this.orderService.getOrdersForEntityById(user!._id, '');
        })
      )
      .subscribe((orders) => {
        this.orders = orders;
        this.setCurrChat(orders[0]?._id);

        this.socketService.on(
          this.socketService.SOCKET_EVENT_ORDER_UPDATED,
          (order) => {
            this.currChat._id === order._id
              ? this.updateCurrChat(order)
              : this.updateOrderInOrders(order);
          }
        );
      });

    this.sharedService.hideElementOnMobile('.main-header');
  }

  updateCurrChat(order: Order) {
    this.currChat = order;
    this.updateOrderInOrders(order);
  }

  updateOrderInOrders(order: Order) {
    if (!this.orders) {
      console.error('Orders array is undefined');
      return;
    }
    const idx = this.orders.findIndex((o) => o._id === order._id);
    this.orders.splice(idx, 1, order);
    this.cdr.detectChanges();
  }

  setCurrChat(orderId: string) {
    const currChat = this.orders.find((order) => orderId === order._id);
    if (currChat) this.currChat = currChat;
  }

  navToChat(orderId: string) {
    this.router.navigateByUrl(`/messages/${this.user._id}/${orderId}`);
  }

  override ngOnDestroy() {
    this.sharedService.showElementOnMobile('.main-header');
    this.socketService.off(this.socketService.SOCKET_EVENT_ORDER_UPDATED);
    super.ngOnDestroy();
  }
}
