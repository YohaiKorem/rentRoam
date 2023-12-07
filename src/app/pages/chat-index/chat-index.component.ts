import { Component, OnInit, OnDestroy } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import {
  Observable,
  tap,
  map,
  of,
  take,
  takeUntil,
  switchMap,
  debounceTime,
} from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { OrderService } from 'src/app/services/order.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { Buyer } from 'src/app/models/buyer.model';
import { Unsub } from 'src/app/services/unsub.class';
@Component({
  selector: 'chat-index',
  templateUrl: './chat-index.component.html',
  styleUrls: ['./chat-index.component.scss'],
})
export class ChatIndexComponent extends Unsub implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private userService: UserService,
    private orderService: OrderService
  ) {
    super();
  }
  user$!: Observable<User>;
  user!: User;
  order$!: Observable<Order>;
  order!: Order;
  messageSender!: User | Buyer;
  senderImg!: string;

  ngOnInit(): void {
    this.route.data
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(({ order, user }) => {
          this.order = order;
          this.order$ = of(order);
          this.user = user;
          this.user$ = of(user);

          if (this.order.buyer._id === this.user._id) {
            return this.userService.getUserById(this.order.hostId);
          } else {
            return of(this.order.buyer);
          }
        })
      )
      .subscribe((sender) => {
        this.messageSender = sender;
        this.senderImg = sender.imgUrl;
      });
    this.sharedService.hideElementOnMobile('.main-header');
    this.sharedService.hideElementOnMobile('mobile-footer');
  }

  updateCurrChat(order: Order) {
    this.order = order;
  }

  override ngOnDestroy(): void {
    this.sharedService.showElementOnMobile('mobile-footer');
    super.ngOnDestroy();
  }
}
