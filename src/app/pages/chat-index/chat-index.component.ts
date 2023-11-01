import { Component, OnInit, OnDestroy } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { Observable, tap, map, of, take } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { OrderService } from 'src/app/services/order.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { Buyer } from 'src/app/models/buyer.model';
@Component({
  selector: 'chat-index',
  templateUrl: './chat-index.component.html',
  styleUrls: ['./chat-index.component.scss'],
})
export class ChatIndexComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private userService: UserService,
    private orderService: OrderService
  ) {}
  user$!: Observable<User>;
  user!: User;
  order$!: Observable<Order>;
  order!: Order;
  messageSender!: User | Buyer;
  senderImg!: string;

  ngOnInit(): void {
    this.route.data.pipe(take(1)).subscribe(({ order, user }) => {
      this.order = order;
      this.order$ = of(order);
      this.user = user;
      this.user$ = of(user);
      if (this.order.buyer._id === this.user._id) {
        this.userService
          .getUserById(this.order.hostId)
          .pipe(take(1))
          .subscribe((user) => {
            this.messageSender = user!;
            this.senderImg = user.imgUrl;
          });
      } else {
        this.messageSender = this.order.buyer;
        this.senderImg = this.messageSender.imgUrl;
      }
    });
    this.sharedService.hideElementOnMobile('.main-header');
  }

  updateCurrChat(order: Order) {}

  ngOnDestroy(): void {
    this.sharedService.showElementOnMobile('.main-header');
  }
}
