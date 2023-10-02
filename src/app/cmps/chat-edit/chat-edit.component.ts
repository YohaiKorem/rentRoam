import { Component, Input, OnInit } from '@angular/core';
import { Buyer } from 'src/app/models/buyer.model';
import { StayHost } from 'src/app/models/host.model';
import { Msg } from 'src/app/models/msg.model';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { StayService } from 'src/app/services/stay.service';
import { take, Observable, of } from 'rxjs';
import { MsgService } from 'src/app/services/msg.service';

@Component({
  selector: 'chat-edit',
  templateUrl: './chat-edit.component.html',
  styleUrls: ['./chat-edit.component.scss'],
})
export class ChatEditComponent implements OnInit {
  @Input() msg: Msg | null = null;
  @Input() order!: Order;
  @Input() user!: User;

  constructor(
    private stayService: StayService,
    private msgService: MsgService
  ) {}

  ngOnInit(): void {
    if (!this.msg) {
      this.msg = new Msg('', '', this.user._id, '', Date.now());

      if (this.order.buyer._id === this.user._id) {
        this.stayService
          .findHostById(this.order.hostId)
          .pipe(take(1))
          .subscribe((host) => {
            if (host && host._id) {
              this.msg!.toId = host._id;
            }
          });
      } else {
        this.msg.toId = this.order.buyer._id;
      }
    }
  }

  onSubmitMsg() {
    if (
      this.msg !== null &&
      this.msg.txt !== undefined &&
      this.msg.fromId !== undefined &&
      this.msg.toId !== undefined &&
      this.msg.sentTimeStamp !== undefined &&
      this.msg.id !== undefined
    ) {
      const msg = { ...this.msg };
      msg.sentTimeStamp = Date.now();

      this.msgService.saveMsg(msg, this.order);
    }
  }
}
