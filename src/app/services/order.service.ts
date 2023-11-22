import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
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
  debounceTime,
} from 'rxjs';
import { HttpService } from './http.service';
import { HttpErrorResponse } from '@angular/common/http';
const BASE_URL = 'order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _orders$ = new BehaviorSubject<Order[]>([]);
  public orders$ = this._orders$.asObservable();
  constructor(private httpService: HttpService) {}

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

  private _updateOrder(order: Order): Observable<Order> {
    return this.httpService.put(`${BASE_URL}/${order._id}`, order).pipe(
      debounceTime(500),
      map((data: any) => data as Order),
      catchError(this._handleError)
    );
  }
  private _addOrder(order: Order): Observable<Order> {
    return this.httpService.post(`${BASE_URL}`, order).pipe(
      debounceTime(500),
      map((data: any) => data as Order),
      catchError(this._handleError)
    );
  }

  private _handleError(err: HttpErrorResponse) {
    console.log('error in order service:', err);
    return throwError(() => err);
  }
}
