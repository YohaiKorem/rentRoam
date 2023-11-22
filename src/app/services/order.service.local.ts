import { Injectable } from '@angular/core';
import _orders from '../../data/order.json';
import {
  Observable,
  BehaviorSubject,
  throwError,
  from,
  tap,
  retry,
  catchError,
  take,
  switchMap,
  of,
  map,
  combineLatest,
} from 'rxjs';
import { Order } from '../models/order.model';
import { storageService } from './async-storage.service';
import { HttpErrorResponse } from '@angular/common/http';
const ENTITY = 'orders';
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _orders$ = new BehaviorSubject<Order[]>([]);
  public orders$ = this._orders$.asObservable();
  constructor() {
    let orders = JSON.parse(localStorage.getItem(ENTITY) || 'null');
    if (!orders || orders.length === 0) {
      orders = this._createOrders();

      localStorage.setItem(ENTITY, JSON.stringify(orders));
    } else {
      this._orders$.next(orders);
    }
  }

  getOrderById(orderId: string): Observable<Order> {
    return this.orders$.pipe(
      take(1),
      map((orders: Order[]) => {
        const order = orders.find((order: Order) => order._id === orderId);

        if (!order) throw new Error('Order not found');
        return order;
      })
    );
  }

  getOrdersForEntityById(
    id: string,
    entity: string = 'host'
  ): Observable<Order[]> {
    return this.orders$.pipe(
      take(1),
      map((orders: Order[]) => {
        let res;
        res =
          entity === 'host'
            ? orders.filter((order: Order) => order.hostId === id)
            : orders.filter((order: Order) => order.buyer._id === id);
        return res;
      })
    );
  }

  public saveOrder(order: Order): Observable<Order> {
    return order._id ? this._updateOrder(order) : this._addOrder(order);
  }

  private _updateOrder(order: Order): Observable<Order> {
    return from(storageService.put(ENTITY, order)).pipe(
      tap((updatedOrder) => {
        const orders = this._orders$.value;
        const orderIdx = orders.findIndex((_order) => _order._id === order._id);
        orders.splice(orderIdx, 1, updatedOrder);
        this._orders$.next([...orders]);
        return updatedOrder;
      }),
      retry(1),
      catchError(this._handleError)
    );
  }
  private _addOrder(order: Order): Observable<Order> {
    let {
      _id,
      hostId,
      buyer,
      totalPrice,
      checkin,
      checkout,
      guests,
      stay,
      msgs,
      status,
    } = order;
    _id = storageService.makeId(24);
    const newOrder = new Order(
      _id,
      hostId,
      buyer,
      totalPrice,
      checkin,
      checkout,
      guests,
      stay,
      msgs,
      status
    );

    return from(storageService.post(ENTITY, newOrder)).pipe(
      tap((newOrder) => {
        const orders = this._orders$.value;
        this._orders$.next([...orders, newOrder]);
      }),
      retry(1),
      catchError(this._handleError)
    );
  }

  private _createOrders() {
    return _orders;
  }
  private _handleError(err: HttpErrorResponse) {
    console.log('error in order service:', err);
    return throwError(() => err);
  }
}
