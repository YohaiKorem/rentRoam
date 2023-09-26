import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faPlusCircle,
  faHouse,
  faList,
  faPencil,
  faEllipsisH,
} from '@fortawesome/free-solid-svg-icons';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { Order } from 'src/app/models/order.model';

import { Stay } from 'src/app/models/stay.model';
import { User } from 'src/app/models/user.model';
import { OrderService } from 'src/app/services/order.service';
import { StayService } from 'src/app/services/stay.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private ngUnsubscribe = new Subject<void>();
  faPlusCircle = faPlusCircle;
  faHouse = faHouse;
  faList = faList;
  faPencil = faPencil;
  faEllipsisH = faEllipsisH;
  stays: Stay[] = [];
  user!: User;
  currCmp: string = 'stays';
  orders$!: Observable<Order[]>;
  orders: Order[] = [];
  constructor(
    private userService: UserService,
    private stayService: StayService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.loggedInUser$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        this.user = user!;
        this.orders$ = this.orderService.getOrdersForHostById(this.user._id);
        this.stayService
          .getAllHostStaysById(this.user._id)
          .pipe(take(1))
          .subscribe((stays) => (this.stays = stays));
      });
    this.orders$.pipe(take(1)).subscribe((orders: Order[]) => {
      console.log(this.orders);
      console.log(orders);
      this.orders = orders;
    });
    console.log(this.orders);
    console.log(this.orders$);
  }

  onUpdateClick(stayId: string) {
    this.router.navigate([`/stay/edit/${stayId}`]);
  }
}
