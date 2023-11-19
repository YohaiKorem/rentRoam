import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { OrderService } from 'src/app/services/order.service';
import { SharedService } from 'src/app/services/shared.service';
import { StayService } from 'src/app/services/stay.service.local';
import { UserService } from 'src/app/services/user.service.local';

@Component({
  selector: 'trip-index',
  templateUrl: './trip-index.component.html',
  styleUrls: ['./trip-index.component.scss'],
})
export class TripIndexComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

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
  ) {}
  ngOnInit(): void {
    this.userService.loggedInUser$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        this.user = user!;
        this.orders$ = this.orderService.getOrdersForEntityById(
          user!._id,
          'buyer'
        );
      });
    this.orders$.pipe(take(1)).subscribe((orders: Order[]) => {
      this.orders = orders;
    });
    this.sharedService.hideElementOnMobile('.main-header');
  }
  onSelectTrip(order: Order) {
    this.currTrip = order;
  }

  ngOnDestroy(): void {
    this.sharedService.showElementOnMobile('.main-header');
  }
}
