import { Component, Input, OnInit } from '@angular/core';
import { Buyer } from 'src/app/models/buyer.model';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { StayService } from 'src/app/services/stay.service';
import { UserService } from 'src/app/services/user.service';
import { take, Observable, of } from 'rxjs';
import { StayHost } from 'src/app/models/host.model';
@Component({
  selector: 'chat-preview',
  templateUrl: './chat-preview.component.html',
  styleUrls: ['./chat-preview.component.scss'],
})
export class ChatPreviewComponent implements OnInit {
  constructor(
    private userService: UserService,
    private stayService: StayService
  ) {}
  @Input() order!: Order;
  @Input() user!: User;
  messageSender$!: Observable<StayHost | Buyer>;
  messageSender!: StayHost | Buyer;
  ngOnInit(): void {
    if (this.order.buyer._id === this.user._id) {
      this.stayService
        .findHostById(this.order.hostId)
        .pipe(take(1))
        .subscribe((host) => (this.messageSender = host!));
    } else {
      this.messageSender$ = of(this.order.buyer);
    }
  }
}
