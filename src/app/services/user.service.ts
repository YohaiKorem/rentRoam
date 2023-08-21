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
  constructor(private http: HttpClient) {
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
      console.log('user that returns from social login', user);
      user.pipe(
        tap((user: SocialUser) => {
          const socialUser = User.fromSocial(user);

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
    let socialUser;
    const socialInfo = User.fromSocial(info);
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
      newUser = User.fromSocial(info);
    } else {
      newUser = new User(
        info.name,
        '',
        info.password,
        info.username,
        this._getRandomId()
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

  // public changeBalance(amount: number, user: User) {
  //   if (!this.loggedInUser) throw new Error('Not logged in');

  //   user.coins = user.coins - amount;
  //   return this.addMove(amount, user);
  // }

  public addMove(amount: number, user: User): User {
    const move = {
      id: this._getRandomId(),
      amount,
      at: Date.now(),
    };
    this._updateUser(user);
    return user;
  }

  private _updateUser(user: User) {
    console.log('before');
    storageService.put(ENTITY, user);
    this._saveLocalUser(user);
  }

  private _saveLocalUser(user: User) {
    this.sessionStorageUser = user;
    const users = this._users$.value;
    const userIdx = users.findIndex((_user) => _user._id === user._id);
    users.splice(userIdx, 1, user);
    console.log(user);
    this._loggedInUser$.next(user);
    return user;
  }

  public get sessionStorageUser(): User {
    const user = sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER);
    return user ? JSON.parse(user) : null;
  }

  private set sessionStorageUser(user: User) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user));
  }

  private _createUsers() {
    // _users.forEach((user) => storageService.post(ENTITY, user));
    //   storageService.post(ENTITY, _users);
    //   this._users$.next(_users);
    return _users;
  }

  private _getRandomId(length = 8): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  private _handleError(err: HttpErrorResponse) {
    console.log('error in user service:', err);
    return throwError(() => err);
  }
}
