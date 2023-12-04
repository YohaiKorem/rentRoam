import { Component, OnInit, OnDestroy } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { Observable, map, take, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Stay } from 'src/app/models/stay.model';
import { StayService } from 'src/app/services/stay.service';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private stayService: StayService,
    private sharedService: SharedService
  ) {}

  order$!: Observable<Order>;
  order!: Order;

  refundDate = {
    free: new Date(),
    partial: new Date(),
  };
  stay$!: Observable<Stay>;
  stay!: Stay;
  ngOnInit(): void {
    this.order$ = this.route.data.pipe(
      tap(({ order }) => {
        this.order = order;
        // this.orderDate.start = new Date(order.checkin);
        // this.orderDate.end = new Date(order.checkout);

        this.refundDate.free = new Date(
          order.checkin - 1000 * 60 * 60 * 24 * 30
        );
        this.refundDate.partial = new Date(
          order.checkin - 1000 * 60 * 60 * 24 * 5
        );
      }),
      map(({ order }) => {
        this.stay$ = this.stayService
          .getStayById(order.stay._id)
          .pipe(tap((stay) => (this.stay = stay)));
        return order;
      })
    );
    this.sharedService.hideElementOnMobile('.main-header');
  }

  ngOnDestroy(): void {
    this.sharedService.showElementOnMobile('.main-header');
  }
}
