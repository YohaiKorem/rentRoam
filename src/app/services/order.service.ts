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

  getOrdersForHostById(hostId: string): Observable<Order[]> {
    return this.orders$.pipe(
      take(1),
      map((orders: Order[]) => {
        console.log('inside service ', orders);

        return orders.filter((order: Order) => order.hostId === hostId);
      })
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
