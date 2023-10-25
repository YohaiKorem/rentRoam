import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { TrackByService } from 'src/app/services/track-by.service';

@Component({
  selector: 'chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent {
  @Input() orders: Order[] = [];
  @Input() user!: User;
  @Input() currChat!: Order;
  @Output() setCurrChat = new EventEmitter();

  constructor(public trackByService: TrackByService) {}
  onSetCurrChat(orderId: string) {
    this.setCurrChat.emit(orderId);
  }
}
