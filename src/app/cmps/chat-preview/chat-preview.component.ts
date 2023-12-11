import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Buyer } from 'src/app/models/buyer.model';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { StayService } from 'src/app/services/stay.service';
import { UserService } from 'src/app/services/user.service';
import { take, Observable, takeUntil, debounceTime, of } from 'rxjs';
import { StayHost } from 'src/app/models/host.model';
import { Unsub } from 'src/app/services/unsub.class';
@Component({
  selector: 'chat-preview',
  templateUrl: './chat-preview.component.html',
  styleUrls: ['./chat-preview.component.scss'],
})
export class ChatPreviewComponent extends Unsub implements OnInit {
  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private stayService: StayService
  ) {
    super();
  }
  @Input() order!: Order;
  @Input() user!: User;
  messageSender!: User | Buyer;
  senderImg!: string;
  formattedDate!: { start: string; end: string };
  isImgLoaded: boolean = false;
  isImgErr: boolean = false;

  ngOnInit(): void {
    this.setMsgSender()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((sender: User | Buyer) => {
        this.messageSender = sender;
        this.senderImg = sender.imgUrl;
        this.cdr.detectChanges();
      });
    this.formattedDate = this.formatDate(this.order);
  }

  setMsgSender(): Observable<User | Buyer> {
    if (!this.order.msgs.length) {
      const idToFind =
        this.order.buyer._id === this.user._id
          ? this.order.hostId
          : this.order.buyer._id;
      return this.userService.getUserById(idToFind);
    }
    const senderId = this.order.msgs[this.order.msgs.length - 1].fromId;

    if (senderId !== this.user._id) {
      return this.userService.getUserById(senderId);
    } else {
      return of(this.user);
    }
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

  onImgLoaded() {
    this.isImgLoaded = true;
    this.isImgErr = false;
  }

  onImgErr() {
    this.isImgLoaded = false;
    this.isImgErr = true;
  }
}
