import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, debounceTime, switchMap, takeUntil } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { OrderService } from 'src/app/services/order.service';
import { SharedService } from 'src/app/services/shared.service';
import { StayService } from 'src/app/services/stay.service';
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
    private stayService: StayService,
    private sharedService: SharedService,
    private orderService: OrderService
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
      });
    this.sharedService.hideElementOnMobile('.main-header');
  }
  onSelectTrip(order: Order) {
    this.currTrip = order;
  }

  override ngOnDestroy(): void {
    this.sharedService.showElementOnMobile('.main-header');
    super.ngOnDestroy();
  }
}
