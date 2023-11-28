import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import {
  Observable,
  BehaviorSubject,
  throwError,
  catchError,
  map,
  debounceTime,
  tap,
  switchMap,
  of,
} from 'rxjs';
import { HttpService } from './http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SocketService } from './socket.service';
const BASE_URL = 'order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _orders$ = new BehaviorSubject<Order[]>([]);
  public orders$ = this._orders$.asObservable();
  constructor(
    private httpService: HttpService,
    private socketService: SocketService
  ) {
    this.listenToOrderUpdates();
  }

  getOrderById(orderId: string): Observable<Order> {
    return this.httpService.get(`${BASE_URL}/${orderId}`).pipe(
      debounceTime(500),
      map((data: any) => data as Order),
      catchError(this._handleError)
    );
  }

  getOrdersForEntityById(
    id: string,
    entity: string = 'host'
  ): Observable<Order[]> {
    return this.httpService.get(`${BASE_URL}/orders/${entity}/${id}`).pipe(
      debounceTime(500),
      map((data: any) => data as Order[]),
      catchError(this._handleError)
    );
  }

  public saveOrder(order: Order): Observable<Order> {
    return order._id ? this._updateOrder(order) : this._addOrder(order);
  }

  private listenToOrderUpdates() {
    this.socketService.on(
      this.socketService.SOCKET_EVENT_ORDER_UPDATED,
      (updatedOrder: Order) => {
        console.log('order in socket listener in order service', updatedOrder);
      }
    );
  }

  emitObservableFromSocket() {}

  private _updateOrder(order: Order): Observable<Order> {
    return this.httpService.put(`${BASE_URL}/${order._id}`, order).pipe(
      debounceTime(500),
      map((data: any) => data as Order),
      tap((updatedOrder: Order) => {
        // Emit the socket event
        this.socketService.emit(
          this.socketService.SOCKET_EVENT_ORDER_UPDATED,
          updatedOrder
        );
        // this.socketService.emit(
        //   this.socketService.SOCKET_EVENT_USER_UPDATED,
        //   updatedOrder
        // );
      }),
      switchMap((updatedOrder: Order) => {
        return this.socketService.listen(
          this.socketService.SOCKET_EVENT_ORDER_UPDATED
        );
        // return new Observable<Order>((observer) => {
        //   const handler = (socketOrder: Order) => {
        //     if (socketOrder._id === updatedOrder._id) {
        //       observer.next(socketOrder);
        //       observer.complete();
        //     }
        //   };

        //   // Listen for socket updates
        //   this.socketService.on(
        //     this.socketService.SOCKET_EVENT_ORDER_UPDATED,
        //     handler
        //   );

        //   // Cleanup
        //   return () => {
        //     this.socketService.off(
        //       this.socketService.SOCKET_EVENT_ORDER_UPDATED,
        //       handler
        //     );
        //   };
        // });
      }),
      catchError(this._handleError)
    );
  }

  private _addOrder(order: Order): Observable<Order> {
    return this.httpService.post(`${BASE_URL}`, order).pipe(
      debounceTime(500),
      map((data: any) => data as Order),
      tap((order: Order) =>
        this.socketService.emit(
          this.socketService.SOCKET_EVENT_ORDER_ADDED,
          order
        )
      ),
      catchError(this._handleError)
    );
  }

  private _handleError(err: HttpErrorResponse) {
    console.log('error in order service:', err);
    return throwError(() => err);
  }
}
