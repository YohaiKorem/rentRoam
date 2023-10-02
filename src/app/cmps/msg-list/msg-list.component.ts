import { Component, Input } from '@angular/core';
import { Buyer } from 'src/app/models/buyer.model';
import { StayHost } from 'src/app/models/host.model';
import { Msg } from 'src/app/models/msg.model';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { StayService } from 'src/app/services/stay.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'msg-list',
  templateUrl: './msg-list.component.html',
  styleUrls: ['./msg-list.component.scss'],
})
export class MsgListComponent {
  @Input() msgs: Msg[] = [];
  @Input() user!: User;
  @Input() order!: Order;
}
