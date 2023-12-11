import { Component, Input, OnInit } from '@angular/core';
import { take, tap, takeUntil, debounceTime, delay } from 'rxjs';
import { Buyer } from 'src/app/models/buyer.model';
import { StayHost } from 'src/app/models/host.model';
import { Msg } from 'src/app/models/msg.model';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { StayService } from 'src/app/services/stay.service';
import { Unsub } from 'src/app/services/unsub.class';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'msg-preview',
  templateUrl: './msg-preview.component.html',
  styleUrls: ['./msg-preview.component.scss'],
})
export class MsgPreviewComponent extends Unsub implements OnInit {
  @Input() msg!: Msg;
  @Input() user!: User;
  @Input() order!: Order;
  msgImg: string = '';
  msgSender!: User;
  isImgLoaded: boolean = false;
  isImgErr: boolean = false;
  formattedDate!: string;

  constructor(
    private userService: UserService,
    private stayService: StayService
  ) {
    super();
  }

  ngOnInit(): void {
    this.msg.fromId === this.user._id
      ? (this.msgSender = this.user)
      : this.userService
          .getUserById(this.msg.fromId)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((user) => {
            console.log('user in msg preview', user);

            this.msgSender = user;
          });
    this.formattedDate = this.formatDate(this.msg);
  }
  onImgErr() {
    this.isImgLoaded = false;
    this.isImgErr = true;
  }

  formatDate(msg: Msg): string {
    const now = new Date();
    const msgDate = new Date(msg.sentTimeStamp);
    const diffInSeconds = Math.floor(
      (now.getTime() - msgDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 120) {
      return 'a minute ago';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else {
      return msgDate.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }
}
