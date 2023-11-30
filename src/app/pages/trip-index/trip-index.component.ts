import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, debounceTime, switchMap, takeUntil } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { OrderService } from 'src/app/services/order.service';
import { SharedService } from 'src/app/services/shared.service';
import { SocketService } from 'src/app/services/socket.service';
import { Unsub } from 'src/app/services/unsub.class';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'trip-index',
  templateUrl: './trip-index.component.html',
  styleUrls: ['./trip-index.component.scss'],
})
export class TripIndexComponent extends Unsub implements OnInit {
  user!: User;
  orders$!: Observable<Order[]>;
  orders: Order[] = [];
  currTrip: Order | null = null;
  isMobile: boolean = window.innerWidth < 700;
  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
    private orderService: OrderService,
    private socketService: SocketService
  ) {
    super();
  }
  ngOnInit(): void {
    this.userService.loggedInUser$
      .pipe(
        switchMap((user) => {
          this.user = user!;
          return this.orderService.getOrdersForEntityById(user!._id, 'buyer');
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((orders: Order[]) => {
        this.orders = orders;
        this.socketService.on(
          this.socketService.SOCKET_EVENT_ORDER_UPDATED,
          (order: Order) => {
            const idx = this.orders.findIndex((o) => o._id === order._id);
            if (idx !== -1) this.orders.splice(idx, 1, order);
            this.cdr.detectChanges();
          }
        );
      });
    this.sharedService.hideElementOnMobile('.main-header');
  }
  onSelectTrip(order: Order) {
    this.currTrip = order;
  }

  override ngOnDestroy(): void {
    this.sharedService.showElementOnMobile('.main-header');
    this.socketService.off(this.socketService.SOCKET_EVENT_ORDER_UPDATED);
    super.ngOnDestroy();
  }
}
