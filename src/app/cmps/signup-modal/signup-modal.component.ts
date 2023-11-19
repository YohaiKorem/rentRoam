import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Observable, Subscription, take } from 'rxjs';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import {
  FacebookLoginProvider,
  GoogleSigninButtonDirective,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedService } from 'src/app/services/shared.service';
import { Credentials } from 'src/app/models/credentials.model';
@Component({
  selector: 'signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss'],
})
export class SignupModalComponent implements OnInit, OnDestroy {
  @ViewChild('customGoogleBtn') customGoogleBtn!: ElementRef;
  @Input() modalType: string = 'Login';
  @Output() typeChanged = new EventEmitter();
  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    private authService: SocialAuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  user!: SocialUser;
  isLoggedIn!: boolean;
  loggedInUser: User | null = null;
  loggedInUser$!: Observable<User | null>;
  credentials: Credentials = { username: '', password: '' };
  isLoginPage: boolean = this.determineIsLoginPage();
  elHeader = document.querySelector('.main-header');

  ngOnInit() {
    this.authService.authState.subscribe((user: SocialUser) => {
      this.user = user;
      this.isLoggedIn = user != null;
      console.log(user);

      this.userService.login(this.user).subscribe((user) => {
        this.loggedInUser = user;
      });
    });
  }

  ngAfterViewInit() {
    this.elHeader?.classList.add('hidden-on-mobile');
  }

  handleSubmit() {
    this.modalType === 'Login'
      ? this.userService
          .login(this.credentials)
          .pipe(take(1))
          .subscribe((user) => {
            this.loggedInUser = user;
          })
      : this.userService
          .signup(this.credentials)
          .pipe(take(1))
          .subscribe((user: User) => {
            this.loggedInUser = user;
          });
    // this.sharedService.toggleSignUpModal();
    // if (this.isLoginPage) this.router.navigateByUrl('/');
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    if (this.isLoginPage) this.router.navigateByUrl('/');
  }

  signOut(): void {
    this.authService.signOut();
  }

  determineIsLoginPage(): boolean {
    let currentRoute = this.activatedRoute.snapshot;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    const routePath = currentRoute.routeConfig?.path || '';
    return routePath === 'login';
  }

  changeModalType() {
    this.modalType = this.modalType === 'Login' ? 'Sign up' : 'Login';
    this.typeChanged.emit(this.modalType);
  }

  handleLogout() {
    this.loggedInUser$ = this.userService.logout();
  }

  triggerGoogleAction() {
    this.customGoogleBtn.nativeElement
      .querySelector('div[role="button"]')
      .click();
  }

  ngOnDestroy() {
    this.elHeader?.classList.remove('hidden-on-mobile');
  }
}
