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

  public login(info: Credentials): Observable<User> {
    return this.httpService.post('auth/login', info).pipe(
      map((data) => data as User),
      tap((user: User) => this.saveLocalUser(user)),
      catchError(this._handleError)
    );
  }

  public signup(credentials: Credentials): Observable<User> {
    return this.httpService.post('auth/signup', credentials).pipe(
      map((data) => data as User),
      tap((user: User) => this.saveLocalUser(user)),
      catchError(this._handleError)
    );
  }
  public socialLogin(info: SocialUser): Observable<User> {
    const route = `auth/${info.provider.toLocaleLowerCase()}`;
    return this.httpService.get(route, info).pipe(
      debounceTime(500),
      map((data) => data as User),
      tap((user: User) => this.saveLocalUser(user)),
      catchError(this._handleError)
    );
  }

  public logout(): Observable<null> {
    return this.httpService.post('auth/logout').pipe(
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

  public updateWishlistInUser(
    wishlist: Wishlist,
    user: User = this.sessionStorageUser
  ): Observable<User> {
    if (!user || !user.wishlists)
      return throwError(() => new Error('Invalid user or wishlist'));

    user = { ...user, wishlists: [...user.wishlists] };
    const wishlistIdx = user.wishlists.findIndex((w) => w.id === wishlist.id);
    wishlistIdx === -1
      ? user.wishlists.push(wishlist)
      : user.wishlists.splice(wishlistIdx, 1, wishlist);

    const updatedUser$ = this.updateUser(user);
    updatedUser$.pipe(take(1)).subscribe();
    return updatedUser$;
  }

  public removeWishlist(wishlistId: string, user: User): Observable<User> {
    const wishlistIdx = user.wishlists.findIndex(
      (wishlist: Wishlist) => wishlist.id === wishlistId
    );
    const updatedUser: User = JSON.parse(JSON.stringify(user));
    updatedUser.wishlists.splice(wishlistIdx, 1);
    return this.updateUser(updatedUser);
  }

  public addWishlistToUser(wishlist: Wishlist, user: User): Observable<User> {
    const updatedUser = { ...user };
    updatedUser.wishlists.push(wishlist);
    return this.updateUser(updatedUser);
  }

  public updateUser(user: User): Observable<User> {
    console.log('updateuser', user);

    return this.httpService.put(`${BASE_URL}/${user._id}`, user).pipe(
      debounceTime(500),
      map((data) => data as User),
      tap((user: User) => this.saveLocalUser(user)),
      retry(1),
      catchError(this._handleError)
    );
  }

  private saveLocalUser(user: any) {
    const userToSave = {
      _id: user._id,
      fullname: user.fullname,
      imgUrl: user.imgUrl,
      username: user.username,
      wishlists: user.wishlists,
      isOwner: user.isOwner,
      id: user.id ? user.id : null,
    };

    this.sessionStorageUser = userToSave;
    this._loggedInUser$.next(userToSave);
    console.log('userToSave', userToSave);
  }

  public getLoggedInUser() {
    console.log('hello freak bitches');

    return this.sessionStorageUser;
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
