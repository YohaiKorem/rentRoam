import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Observable, Subscription, takeUntil, tap } from 'rxjs';
import { Unsub } from 'src/app/services/unsub.class';

@Component({
  selector: 'signup',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends Unsub implements OnInit {
  constructor(private userService: UserService) {
    super();
  }
  loggedInUser: User | null = null;
  loggedInUser$!: Observable<User | null>;
  isLoginClicked: boolean = false;
  isSignupClicked: boolean = true;
  credentials: any = {};
  signupInfo: any = {};

  ngOnInit(): void {
    this.loggedInUser$ = this.userService.loggedInUser$;
    this.loggedInUser$.pipe(takeUntil(this.unsubscribe$)).subscribe((user) => {
      this.loggedInUser = user;
    });
  }

  handleLogIn() {
    this.loggedInUser$ = this.userService.login(this.credentials).pipe(
      tap((user) => {
        this.loggedInUser = user;
      })
    );
  }
  handleSignup() {
    this.loggedInUser$ = this.userService.signup(this.signupInfo).pipe(
      tap((user) => {
        this.loggedInUser = user;
      })
    );
  }
  handleLogout() {
    this.loggedInUser$ = this.userService.logout();
  }
  handleToggleForm() {
    this.isLoginClicked = !this.isLoginClicked;
    this.isSignupClicked = !this.isSignupClicked;
  }
}
