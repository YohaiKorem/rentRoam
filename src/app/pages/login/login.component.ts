import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'signup',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private userService: UserService) {}
  loggedInUser: User | null = null;
  loggedInUser$!: Observable<User | null>;
  isLoginClicked: boolean = false;
  isSignupClicked: boolean = true;
  credentials: any = {};
  signupInfo: any = {};

  ngOnInit(): void {
    this.loggedInUser$ = this.userService.loggedInUser$;
    this.loggedInUser$.subscribe((user) => {
      this.loggedInUser = user;
    });
  }

  handleLogIn() {
    this.userService.login(this.credentials).subscribe((user) => {
      this.loggedInUser = user;
    });
  }
  handleSignup() {
    this.userService.signup(this.signupInfo).subscribe((user) => {
      this.loggedInUser = user;
    });
  }
  handleLogout() {
    this.loggedInUser = this.userService.logout();
  }
  handleToggleForm() {
    this.isLoginClicked = !this.isLoginClicked;
    this.isSignupClicked = !this.isSignupClicked;
  }
}
