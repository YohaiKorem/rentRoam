import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
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
} from 'rxjs';
import { storageService } from './async-storage.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import _users from '../../data/user.json';
import { SignupInfo } from '../models/signup-info.model';
import { Wishlist } from '../models/wishlist.model';
import { UtilService } from './util.service';

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser';

const ENTITY = 'user';
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
  constructor(private http: HttpClient, private utilService: UtilService) {
    //   // this.getUsers().subscribe((users) => {
    let users = JSON.parse(localStorage.getItem(ENTITY) || 'null');
    if (!users || users.length === 0) {
      users = this._createUsers();
      localStorage.setItem(ENTITY, JSON.stringify(users));
    } else {
      this._users$.next(users);
    }
  }
  // }

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

  public clearInterval() {
    this.locInterval.clearInterval();
  }

  public getUsers() {
    return from(storageService.query(ENTITY)).pipe(
      retry(1),
      catchError(this._handleError)
    );
  }

  public login(info: any): Observable<User> {
    let user;

    if (info instanceof SocialUser) {
      user = this._socialLogin(info);

      return user.pipe(
        tap((user: SocialUser) => {
          const socialUser = User.fromFacebook(user);

          this._loggedInUser$.next(socialUser);
          console.log('socialLogin inside login method', user);
          console.log('socialLogin inside login method', socialUser);
        })
      );
      return user;
    } else {
      console.log('app login', info);

      user = this._appLogin(info);
    }
    if (user) {
      return user.pipe(
        tap((user) => {
          this._loggedInUser$.next(user);
        }),
        catchError(this._handleError)
      );
    } else throw new Error('Invalid credentials/social credentials');
  }

  private _appLogin(info: any) {
    return this.getUsers().pipe(
      map((users) => {
        const user = users.find(
          (user) =>
            user.username === info.name && user.password === info.password
        );

        if (user) {
          return this._saveLocalUser(user);
        } else {
          throw new Error('Invalid credentials');
        }
      })
    );
  }

  private _socialLogin(info: SocialUser) {
    console.log(info);

    let socialUser;

    const socialInfo =
      info.provider === 'GOOGLE'
        ? User.fromGoogle(info)
        : User.fromFacebook(info);
    console.log('socialInfo', socialInfo);
    return this.getUsers().pipe(
      map((users) => {
        const user = users.find((user) => user._id === socialInfo._id);

        if (user) {
          console.log('social login user truthy');

          socialUser = this._saveLocalUser(user);
          return socialUser;
        } else {
          console.log('social login user falsy');

          socialUser = this.signup(info);
          return socialUser;
        }
      })
    );

    return socialUser;
  }

  public signup(info: any) {
    let newUser: User;
    if (info instanceof SocialUser) {
      console.log(info);
      newUser =
        info.provider === 'GOOGLE'
          ? User.fromGoogle(info)
          : User.fromFacebook(info);
    } else {
      newUser = new User(
        info.name,
        '',
        info.password,
        info.username,
        this.utilService.getRandomId(),
        []
      );
    }

    newUser = this._saveLocalUser(newUser);
    this._loggedInUser$.next(newUser);
    return from(storageService.post(ENTITY, newUser)).pipe(
      switchMap(() => {
        const users = this._users$.value;
        this._users$.next([...users, newUser]);
        return of(newUser);
      }),
      catchError(this._handleError)
    );
  }

  public logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER);

    this._loggedInUser$.next(null);
    return null;
  }

  public updateWishlistInUser(
    wishlist: Wishlist,
    user: User = this.sessionStorageUser
  ): User {
    if (!user || !user.wishlists) {
      throw new Error('Invalid user or wishlist');
    }
    user = { ...user, wishlists: [...user.wishlists] };
    const wishlistIdx = user.wishlists.findIndex((w) => w.id === wishlist.id);
    wishlistIdx === -1
      ? user.wishlists.push(wishlist)
      : user.wishlists.splice(wishlistIdx, 1, wishlist);

    this._updateUser(user);
    return user;
  }
  public updateUser(user: User) {
    return this._updateUser(user);
  }

  public removeWishlist(wishlistId: string, user: User) {
    const wishlistIdx = user.wishlists.findIndex(
      (wishlist: Wishlist) => wishlist.id === wishlistId
    );
    const updatedUser: User = JSON.parse(JSON.stringify(user));
    updatedUser.wishlists.splice(wishlistIdx, 1);
    this._updateUser(updatedUser);
    return updatedUser;
  }

  public addWishlistToUser(wishlist: Wishlist, user: User) {
    const updatedUser = { ...user };
    updatedUser.wishlists.push(wishlist);
    this._updateUser(updatedUser);
  }

  private _updateUser(user: User) {
    storageService.put(ENTITY, user);
    return this._saveLocalUser(user);
  }

  private _saveLocalUser(user: User) {
    this.sessionStorageUser = user;
    const users = this._users$.value;
    const userIdx = users.findIndex((_user) => _user._id === user._id);
    users.splice(userIdx, 1, user);
    this._loggedInUser$.next(user);
    return user;
  }

  public getLoggedInUser() {
    return this._loggedInUser$.value;
  }

  public get sessionStorageUser(): User {
    const user = sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER);
    return user ? JSON.parse(user) : null;
  }

  private set sessionStorageUser(user: User) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user));
  }

  public getUserById(id: string): Observable<User> {
    const users = this._users$.value;
    const user = users.find((_user) => _user._id === id);
    if (user) return of(user);
    throw new Error('user not found');
  }

  private _createUsers() {
    // _users.forEach((user) => storageService.post(ENTITY, user));
    //   storageService.post(ENTITY, _users);
    //   this._users$.next(_users);
    return _users;
  }

  private _handleError(err: HttpErrorResponse) {
    console.log('error in user service:', err);
    return throwError(() => err);
  }
}
