import { Component, Input } from '@angular/core';
import { Msg } from 'src/app/models/msg.model';

@Component({
  selector: 'msg-list',
  templateUrl: './msg-list.component.html',
  styleUrls: ['./msg-list.component.scss'],
})
export class MsgListComponent {
  @Input() msgs: Msg[] = [];
}
