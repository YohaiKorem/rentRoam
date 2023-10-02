import { Component, Input } from '@angular/core';
import { Msg } from 'src/app/models/msg.model';

@Component({
  selector: 'msg-preview',
  templateUrl: './msg-preview.component.html',
  styleUrls: ['./msg-preview.component.scss'],
})
export class MsgPreviewComponent {
  @Input() msg!: Msg;
}
