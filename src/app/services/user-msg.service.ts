import { Injectable } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  throwError,
  from,
  tap,
  retry,
  catchError,
  map,
  of,
  switchMap,
  take,
  debounceTime,
} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UserMsgService {
  private _msg$ = new BehaviorSubject<any>('');
  public msg$ = this._msg$.asObservable();
  private _isShowMsg$ = new BehaviorSubject<boolean>(false);
  public isShowMsg$ = this._isShowMsg$.asObservable();
  constructor() {}

  public showUserMsg(msg: any): Observable<any> {
    this._msg$.next(msg);
    return of(msg);
  }

  public showUserErr(err: any): Observable<any> {
    const msg = err.error.msg;

    this._msg$.next(msg);
    return throwError(() => err);
  }
}
