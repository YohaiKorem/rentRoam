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
import { ActivatedRoute, Router } from '@angular/router';

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
    private authService: SocialAuthService,
    private router: Router
  ) {}
  user!: SocialUser;
  isLoggedIn!: boolean;
  loggedInUser: User | null = null;
  loggedInUser$!: Observable<User>;
  credentials: any = {};
  isLoginPage: boolean = this.determineIsLoginPage();
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

  ngAfterViewInit() {
    const intervalId = setInterval(() => {
      console.log('looked for iframe');

      const elIframe = document.querySelector('iframe');
      if (elIframe) {
        const elContainer = document.getElementById('container');
        elContainer!.style.width = '100%';
        const elProblematicIframeDiv = document.querySelector(
          '#container > div'
        ) as HTMLElement;
        elProblematicIframeDiv!.style.width = '100%';
        elProblematicIframeDiv!.style.maxWidth = '100%';

        elIframe.style.width = '100%';
        console.log('found iframe');
        clearInterval(intervalId);
      }
    }, 1000);
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

  determineIsLoginPage(): boolean {
    return this.router.url === '/login';
  }

  handleLogout() {
    this.loggedInUser = this.userService.logout();
  }
}
