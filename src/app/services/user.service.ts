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
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { User } from '../models/user.model';
import { Wishlist } from '../models/wishlist.model';
import { HttpService } from './http.service';
import { Credentials } from '../models/credentials.model';
const BASE_URL = 'user';

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _users$ = new BehaviorSubject<User[]>([]);
  public users$ = this._users$.asObservable();
  private _loggedInUser$ = new BehaviorSubject<User | null>(
    this.sessionStorageUser
  );
  public loggedInUser$ = this._loggedInUser$.asObservable();
  private _userCoords$ = new BehaviorSubject<{
    lat: number | null;
    lng: number | null;
  }>({ lat: null, lng: null });
  public userCoords$ = this._userCoords$.asObservable();
  public locInterval: any;
  constructor(private httpService: HttpService) {}

  public login(info: Credentials | SocialUser): Observable<User> {
    return this.httpService.post('auth/login', info).pipe(
      map((data) => data as User),
      tap((user: User) => {
        return this.saveLocalUser(user);
      }),
      catchError(this._handleError)
    );
  }

  public logout(user: User): Observable<null> {
    return this.httpService.post('auth/logout', user).pipe(
      tap(() => {
        sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER);
        this._loggedInUser$.next(null);
      }),
      map(() => null),
      catchError(this._handleError)
    );
  }

  public getUserById(userId: string): Observable<User> {
    return this.httpService.get(`${BASE_URL}/${userId}`).pipe(
      debounceTime(500),
      map((data: any) => data as User),
      catchError(this._handleError)
    );
  }

  public getUserLoc() {
    if (navigator.geolocation) {
      this.locInterval = setInterval(
        () =>
          navigator.geolocation.getCurrentPosition(
            (position) => {
              let userLoc = { lat: 0, lng: 0 };
              userLoc.lat = position.coords.latitude;
              userLoc.lng = position.coords.longitude;
              this._userCoords$.next(userLoc);
            },
            () => {
              console.error('Error obtaining geolocation');
            }
          ),
        60000
      );
    } else {
      console.error('Browser does not support geolocation');
    }
  }

  private saveLocalUser(user: User): Observable<User> {
    const userToSave = {
      _id: user._id,
      fullname: user.fullname,
      imgUrl: user.imgUrl,
      username: user.username,
      wishlists: user.wishlists,
      isOwner: user.isOwner,
    };
    this.sessionStorageUser = userToSave;
    this._loggedInUser$.next(userToSave);

    return of(userToSave);
  }

  public get sessionStorageUser(): User {
    const user = sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER);
    return user ? JSON.parse(user) : null;
  }

  private set sessionStorageUser(user: User) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user));
  }

  private _handleError(err: HttpErrorResponse) {
    console.log('error in user service:', err);
    return throwError(() => err);
  }
}
