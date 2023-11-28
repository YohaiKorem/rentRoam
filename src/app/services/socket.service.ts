import { Injectable } from '@angular/core';
import * as socketIO from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service.local';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  SOCKET_EMIT_LOGIN = 'set-user-socket';
  SOCKET_EMIT_LOGOUT = 'unset-user-socket';
  SOCKET_EMIT_SET_TOPIC = 'chat-set-topic';
  SOCKET_EVENT_ADD_MSG = 'chat-add-msg';
  SOCKET_EMIT_SEND_MSG = 'chat-send-msg';
  SOCKET_EVENT_USER_UPDATED = 'user-updated';
  SOCKET_EVENT_ORDER_ADDED = 'order-added';
  SOCKET_EVENT_ORDER_UPDATED = 'order-updated';

  private clientSocket: any;
  constructor(private userService: UserService) {
    this.setup();
  }
  public setup() {
    this.clientSocket = socketIO.io(environment.apiBaseUrl);
    setTimeout(() => {
      const user: User | null = this.userService.getLoggedInUser();
      if (user) this.login(user._id);
    }, 500);
  }
  public on(eventName: string, cb: (data: any) => void) {
    this.clientSocket.on(eventName, cb);
  }

  public off(eventName: string, cb = null) {
    if (!this.clientSocket) return;
    if (!cb) this.clientSocket.removeAllListeners(eventName);
    else this.clientSocket.off(eventName, cb);
  }
  public emit(eventName: string, data: any) {
    data = JSON.parse(JSON.stringify(data));
    this.clientSocket.emit(eventName, data);
  }
  public login(userId: string) {
    this.clientSocket.emit(this.SOCKET_EMIT_LOGIN, userId);
  }
  public logout() {
    this.clientSocket.emit(this.SOCKET_EMIT_LOGOUT);
  }
  public terminate() {
    this.clientSocket = null;
  }
}
