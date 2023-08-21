import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Observable, Subscription } from 'rxjs';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import {
  FacebookLoginProvider,
  GoogleSigninButtonDirective,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';

import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss'],
})
export class SignupModalComponent implements OnInit {
  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    private authService: SocialAuthService
  ) {}
  user!: SocialUser;
  isLoggedIn!: boolean;
  loggedInUser: User | null = null;
  loggedInUser$!: Observable<User>;
  credentials: any = {};

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.isLoggedIn = user != null;
      console.log(user);

      this.userService.login(this.user).subscribe((user) => {
        this.loggedInUser = user;
      });
    });
  }

  handleLogIn() {
    this.userService.login(this.credentials).subscribe((user) => {
      this.loggedInUser = user;
    });
    this.sharedService.toggleSignUpModal();
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

  handleLogout() {
    this.loggedInUser = this.userService.logout();
  }
}
