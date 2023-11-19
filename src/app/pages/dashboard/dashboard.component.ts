import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { StayService } from 'src/app/services/stay.service';
import { TrackByService } from 'src/app/services/track-by.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
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
    private authService: SocialAuthService
  ) {}

  ngOnInit(): void {
    const res = this.userService.loggedInUser$.pipe(
      takeUntil(this.ngUnsubscribe),
      switchMap((user) => {
        this.user = user!;
        return forkJoin({
          orders: this.orderService.getOrdersForEntityById(this.user._id),
          stays: this.stayService.getAllHostStaysById(this.user._id),
        });
      }),
      take(1)
    );
    res.pipe(take(1)).subscribe(({ orders, stays }) => {
      this.orders = orders;
      this.stays = stays;

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
    updatedOrder.pipe(take(1)).subscribe((updatedOrder: Order) => {
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
      .subscribe((user) => (this.user = user));
    this.authService.signOut();

    this.router.navigate(['/stay']);
  }

  showRemoveOption(stayId: string) {
    this.stayIdToRmove = stayId;
  }

  onRemoveStay(stayId: string) {
    this.stayService
      .removeStay(stayId)
      .pipe(take(1))
      .subscribe((removedStayId) => {
        this.stays = this.stays.filter((stay) => stay._id !== removedStayId);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.unsubscribe();
    this.sharedService.showElementOnMobile('.main-header');
  }
}
