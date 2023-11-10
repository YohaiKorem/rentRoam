import { Component, OnInit, OnDestroy } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { Observable, map, take, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Stay } from 'src/app/models/stay.model';
import { StayService } from 'src/app/services/stay.service.local';
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
  currDate = {
    start: new Date(),
    end: new Date(),
  };
  stay$!: Observable<Stay>;
  stay!: Stay;
  ngOnInit(): void {
    this.order$ = this.route.data.pipe(
      tap(({ order }) => {
        this.order = order;
        this.currDate.start = new Date(order.checkin);
        this.currDate.end = new Date(order.checkout);
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
