import { Component, Input, OnInit } from '@angular/core';
import { Buyer } from 'src/app/models/buyer.model';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { StayService } from 'src/app/services/stay.service.local';
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
  messageSender!: User | Buyer;
  senderImg!: string;
  formattedDate!: { start: string; end: string };
  isImgLoaded: boolean = false;
  isImgErr: boolean = false;

  ngOnInit(): void {
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
    this.formattedDate = this.formatDate(this.order);
  }

  formatDate(order: Order): { start: string; end: string } {
    const { checkin, checkout } = order;
    return {
      start: new Date(checkin).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      }),
      end: new Date(checkout).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      }),
    };
  }
  onImgErr() {
    console.log('error');

    this.isImgLoaded = false;
    this.isImgErr = true;
  }
}
