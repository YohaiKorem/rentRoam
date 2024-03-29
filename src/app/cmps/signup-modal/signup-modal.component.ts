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
import { Observable, tap, take, catchError, takeUntil } from 'rxjs';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import {
  FacebookLoginProvider,
  GoogleSigninButtonDirective,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { Credentials } from 'src/app/models/credentials.model';
import { UserMsgService } from 'src/app/services/user-msg.service';
import { Unsub } from 'src/app/services/unsub.class';
@Component({
  selector: 'signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss'],
})
export class SignupModalComponent extends Unsub implements OnInit {
  @ViewChild('customGoogleBtn') customGoogleBtn!: ElementRef;
  @Input() modalType: string = 'Login';
  @Output() typeChanged = new EventEmitter();
  constructor(
    private userService: UserService,
    private userMsgService: UserMsgService,
    private sharedService: SharedService,
    private authService: SocialAuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }
  user!: SocialUser;
  isLoggedIn!: boolean;
  loggedInUser: User | null = null;
  loggedInUser$: Observable<User | null> = this.userService.loggedInUser$;
  credentials: Credentials = { username: '', password: '' };
  isLoginPage: boolean = this.determineIsLoginPage();
  elHeader = document.querySelector('.main-header');

  ngOnInit() {
    this.authService.authState
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user: SocialUser) => {
        this.user = user;
        this.isLoggedIn = user != null;
        this.userService
          .socialLogin(this.user)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((user) => {
            this.loggedInUser = user;
            this.router.navigate(['/stay'], {
              relativeTo: this.activatedRoute,
              queryParamsHandling: 'preserve',
            });
          });
      });
  }

  ngAfterViewInit() {
    if (this.isLoginPage) {
      this.sharedService.hideElementOnMobile('google-map-cmp');
      this.sharedService.hideElementOnMobile('app-header');
    } else {
      this.sharedService.toggleClassOnElement(
        'google-map-cmp',
        'hidden',
        'add'
      );
    }
  }

  handleSubmit() {
    if (this.modalType === 'Login') {
      this.userService
        .login(this.credentials)
        .pipe(
          take(1),
          catchError((err) => this.userMsgService.showUserErr(err.error.err))
        )
        .subscribe((user) => {
          this.loggedInUser = user;
          this.router.navigate(['/stay'], {
            relativeTo: this.activatedRoute,
            queryParamsHandling: 'preserve',
          });
        });
    } else {
      this.userService
        .signup(this.credentials)
        .pipe(
          take(1),
          catchError((err) => this.userMsgService.showUserErr(err.error.msg))
        )
        .subscribe((user: User) => {
          this.loggedInUser = user;
          this.router.navigate(['/stay'], {
            relativeTo: this.activatedRoute,
            queryParamsHandling: 'preserve',
          });
        });
    }
  }
  // this.sharedService.toggleSignUpModal();
  // if (this.isLoginPage) this.router.navigateByUrl('/');

  handleErr(err: any) {
    return this.userMsgService.showUserErr(err).pipe(
      take(1),
      tap(() => (this.loggedInUser = null))
    );
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

  override ngOnDestroy() {
    if (this.isLoginPage) {
      this.sharedService.showElementOnMobile('google-map-cmp');
      this.sharedService.showElementOnMobile('app-header');
    } else {
      this.sharedService.toggleClassOnElement(
        'google-map-cmp',
        'hidden',
        'remove'
      );
    }
    super.ngOnDestroy();
  }
}
