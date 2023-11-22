import { Injectable } from '@angular/core';
import { Msg } from '../models/msg.model';
import { Order } from '../models/order.model';
import { OrderService } from './order.service.local';
import { Observable } from 'rxjs';
import { UtilService } from './util.service';
@Injectable({
  providedIn: 'root',
})
export class MsgService {
  constructor(
    private orderService: OrderService,
    private utilsService: UtilService
  ) {}

  public saveMsg(msg: Msg, order: Order): Observable<Order> {
    return msg.id ? this._updateMsg(msg, order) : this._addMsg(msg, order);
  }

  private _updateMsg(msg: Msg, order: Order) {
    const idxToRemove = order.msgs.findIndex((m) => m.id === msg.id);
    order.msgs.splice(idxToRemove, 1, msg);
    return this.orderService.saveOrder(order);
  }

  private _addMsg(msg: Msg, order: Order) {
    const updatedOrder = { ...order };
    const msgToAdd = { ...msg };
    msgToAdd.id = this.utilsService.getRandomId();
    updatedOrder.msgs = updatedOrder.msgs.concat(msgToAdd);
    return this.orderService.saveOrder(updatedOrder);
  }
}
