import { Component, Input, OnInit } from '@angular/core';
import { take, tap } from 'rxjs';
import { Buyer } from 'src/app/models/buyer.model';
import { StayHost } from 'src/app/models/host.model';
import { Msg } from 'src/app/models/msg.model';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { StayService } from 'src/app/services/stay.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'msg-preview',
  templateUrl: './msg-preview.component.html',
  styleUrls: ['./msg-preview.component.scss'],
})
export class MsgPreviewComponent implements OnInit {
  @Input() msg!: Msg;
  @Input() user!: User;
  @Input() order!: Order;
  msgImg: string = '';
  msgSender!: User;

  constructor(
    private userService: UserService,
    private stayService: StayService
  ) {}

  ngOnInit(): void {
    this.msg.fromId === this.user._id
      ? (this.msgSender = this.user)
      : this.userService
          .getUserById(this.msg.fromId)
          .pipe(tap((user) => (this.msgSender = user)));
  }
}
