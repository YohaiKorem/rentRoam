import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { Buyer } from 'src/app/models/buyer.model';
import { StayHost } from 'src/app/models/host.model';
import { Msg } from 'src/app/models/msg.model';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { StayService } from 'src/app/services/stay.service.local';
import { TrackByService } from 'src/app/services/track-by.service';
import { UserService } from 'src/app/services/user.service.local';

@Component({
  selector: 'msg-list',
  templateUrl: './msg-list.component.html',
  styleUrls: ['./msg-list.component.scss'],
})
export class MsgListComponent {
  @Input() msgs: Msg[] = [];
  @Input() user!: User;
  @Input() order!: Order;
  constructor(
    private cdr: ChangeDetectorRef,
    public trackByService: TrackByService
  ) {}
  ngOnInit() {
    console.log(this.msgs);
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes['msgs'] || changes['user'] || changes['order'])
    //   this.cdr.detectChanges();
    console.log(this.msgs);
  }
}
