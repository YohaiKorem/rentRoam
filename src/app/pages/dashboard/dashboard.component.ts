import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  faPlusCircle,
  faHouse,
  faList,
  faPencil,
  faEllipsisH,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {
  Observable,
  Subject,
  take,
  takeUntil,
  switchMap,
  forkJoin,
} from 'rxjs';
import { Order } from 'src/app/models/order.model';

import { Stay } from 'src/app/models/stay.model';
import { User } from 'src/app/models/user.model';
import { OrderService } from 'src/app/services/order.service';
import { SharedService } from 'src/app/services/shared.service';
import { SocketService } from 'src/app/services/socket.service';
import { StayService } from 'src/app/services/stay.service';
import { TrackByService } from 'src/app/services/track-by.service';
import { Unsub } from 'src/app/services/unsub.class';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends Unsub implements OnInit, OnDestroy {
  faPlusCircle = faPlusCircle;
  faHouse = faHouse;
  faList = faList;
  faPencil = faPencil;
  faEllipsisH = faEllipsisH;
  faTrash = faTrash;
  stays: Stay[] = [];
  user!: User | null;
  currCmp: string = 'orders';
  orders$!: Observable<Order[]>;
  orders: Order[] = [];
  statsMap!: { pending: number; approved: number; declined: number };
  stayIdToRmove: string = '';
  constructor(
    private userService: UserService,
    private stayService: StayService,
    private orderService: OrderService,
    public trackByService: TrackByService,
    private router: Router,
    private sharedService: SharedService,
    private authService: SocialAuthService,
    private cdr: ChangeDetectorRef,
    private socketService: SocketService
  ) {
    super();
  }

  ngOnInit(): void {
    this.userService.loggedInUser$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((user) => {
          this.user = user!;
          return forkJoin({
            orders: this.orderService.getOrdersForEntityById(this.user._id),
            stays: this.stayService.getAllHostStaysById(this.user._id),
          });
        }),
        takeUntil(this.unsubscribe$)
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ orders, stays }) => {
        this.orders = orders;
        this.stays = stays;
        this.socketService.on(
          this.socketService.SOCKET_EVENT_ORDER_ADDED,
          (order: Order) => {
            if (this.user && this.user._id === order.hostId)
              this.orders.unshift(order);
          }
        );
        this.updateOrderStatsMap();
      });

    this.sharedService.hideElementOnMobile('.main-header');
  }

  onUpdateClick(stayId: string) {
    this.router.navigate([`/stay/edit/${stayId}`]);
  }

  updateOrderStatsMap() {
    const statsMap = this.orders.reduce(
      (acc: any, order: Order) => {
        if (!acc[order.status]) acc[order.status] = 0;
        acc[order.status]++;
        return acc;
      },
      { pending: 0, approved: 0, declined: 0 }
    );

    this.statsMap = statsMap;
  }
  onOrderStatChanged(order: Order) {
    const updatedOrder = this.orderService.saveOrder(order);
    updatedOrder
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updatedOrder: Order) => {
        const idxToRemove = this.orders.findIndex(
          (order: Order) => order._id === updatedOrder._id
        );
        this.orders.splice(idxToRemove, 1, updatedOrder);
        this.updateOrderStatsMap();
      });
  }

  onLogout() {
    this.userService
      .logout()
      .pipe(take(1))
      .subscribe((user) => {
        if (this.user && this.user.id) this.authService.signOut();
        this.user = null;
        this.router.navigate(['/stay']);
      });

    // this.router.navigate(['/stay']);
  }

  showRemoveOption(stayId: string) {
    this.stayIdToRmove = stayId;
  }

  onRemoveStay(stayId: string) {
    this.stayService
      .removeStay(stayId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((removedStayId) => {
        this.stays = this.stays.filter((stay) => stay._id !== removedStayId);
      });
  }

  override ngOnDestroy(): void {
    this.sharedService.showElementOnMobile('.main-header');
    super.ngOnDestroy();
  }
}
