import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { faAirbnb } from '@fortawesome/free-brands-svg-icons';
import { faSearch, faGlobe, faBars } from '@fortawesome/free-solid-svg-icons';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuTrigger } from '@angular/material/menu';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import {
  Observable,
  Subscription,
  catchError,
  debounceTime,
  map,
  of,
  take,
  tap,
} from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { Subject, takeUntil } from 'rxjs';
import { SearchParam } from 'src/app/models/stay.model';
import { StayService } from 'src/app/services/stay.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment';
import { TrackByService } from 'src/app/services/track-by.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Unsub } from 'src/app/services/unsub.class';
import { HttpClient } from '@angular/common/http';
import { AutoCompleteService } from 'src/app/services/auto-complete.service';

declare var google: any;
@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  host: {
    class: 'main-header after-parent',
  },
})
export class AppHeaderComponent extends Unsub implements OnInit {
  @ViewChild('locMenuTrigger') locMenuTrigger!: MatMenuTrigger;
  @ViewChild('dateMenuTrigger') dateMenuTrigger!: MatMenuTrigger;
  @ViewChild('guestsMenuTrigger') guestsMenuTrigger!: MatMenuTrigger;
  @ViewChild('loginSignupTrigger') loginSignupTrigger!: MatMenuTrigger;
  @ViewChild('picker') picker!: MatDateRangePicker<any>;
  @ViewChild('inputField') inputField!: ElementRef;
  searchParam = {} as SearchParam;
  private searchSubject$ = new Subject<void>();
  faAirbnb = faAirbnb;
  faSearch = faSearch;
  faGlobe = faGlobe;
  faBars = faBars;
  isSearchOpen: boolean = false;
  currSearch: string = '';
  locSearch: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  suggestions: any[] = [];
  modalType: string = '';
  loggedInUser: User | null = null;
  loggedInUser$!: Observable<User | null>;
  isMobile = window.innerWidth <= 780;
  autoComplete: any;
  constructor(
    private sharedService: SharedService,
    private stayService: StayService,
    private userService: UserService,
    private authService: SocialAuthService,
    public trackByService: TrackByService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private autoCompleteService: AutoCompleteService
  ) {
    super();
  }

  ngOnInit() {
    this.stayService.searchParams$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((searchParam) => (this.searchParam = searchParam));

    this.searchSubject$
      .pipe(takeUntil(this.unsubscribe$), debounceTime(500))
      .subscribe(() => {
        this.stayService.setSearchParams(this.searchParam);
        this.router.navigate(['/stay'], {
          relativeTo: this.activatedRoute,
          queryParamsHandling: 'preserve',
        });
      });

    this.userService.loggedInUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => {
        this.loggedInUser = user;
        if (this.loggedInUser != null) this.modalType = '';
      });
    this.sharedService.toggleSignupModal$.subscribe(() => {
      this.modalType = '';
    });
    this.autoCompleteService.apiLoaded$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((isLoaded) => {
        isLoaded
          ? (this.autoComplete = this.autoCompleteService.autoComplete)
          : (this.autoComplete = null);
      });
  }
  ngAfterViewInit() {}

  getSuggestions(event: any) {
    if (!event.target.value || !this.autoComplete) {
      this.suggestions = [];
      return;
    }
    this.autoCompleteService.autoComplete.getQueryPredictions(
      { input: this.locSearch },
      (predictions: any) => {
        this.suggestions = predictions;
      }
    );
  }

  toggleSignupModal() {
    this.sharedService.toggleSignUpModal();
  }

  openSearchMenuMobile() {
    this.sharedService.openSearchMenuMobile();
  }

  openFilterModal() {
    this.sharedService.openModal('Filters');
  }

  openSearch(str: string) {
    if (this.isMobile) this.openSearchMenuMobile();
    this.isSearchOpen = true;
    this.setCurrSearch(str);
  }

  setCurrSearch(str: string, debug: string = 'debug') {
    if (str === 'loc') {
      this.guestsMenuTrigger.closeMenu();
      this.locMenuTrigger.openMenu();
      this.inputField.nativeElement.focus();
      this.picker.close();
    } else if (str === 'check-in' || str === 'check-out') {
      this.picker.open();
      this.guestsMenuTrigger.closeMenu();
      this.locMenuTrigger.closeMenu();
    } else if (str === 'guests') {
      this.locMenuTrigger.closeMenu();
      this.picker.close();
      this.guestsMenuTrigger.openMenu();
    } else {
      this.locMenuTrigger.closeMenu();
      this.picker.close();
      this.guestsMenuTrigger.closeMenu();
    }
    this.currSearch = str;
  }

  onCloseMenu() {
    this.setCurrSearch('', 'onclosemenu called this');
  }

  updateGuests(ev: any, num: number) {
    ev.stopPropagation();
    if (ev.target.className.includes('adults'))
      this.searchParam.guests.adults += num;
    if (ev.target.className.includes('children'))
      this.searchParam.guests.children += num;
    if (ev.target.className.includes('infants'))
      this.searchParam.guests.infants += num;
  }

  closeSearch() {
    this.isSearchOpen = false;
    this.onCloseMenu();
  }

  clearSearch() {
    this.stayService.clearSearch();
    this.router.navigate(['/stay'], {
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'preserve',
    });
    this.cdr.detectChanges();
  }

  setLoc() {
    this.searchParam.location.name = this.locSearch;
  }

  openLoginSignup() {
    setTimeout(() => {
      this.sharedService.addStyleToElement(
        '.cdk-overlay-backdrop',
        'visibility',
        'visible'
      );
    }, 300);
  }

  onCloseLoginSignup() {
    this.sharedService.addStyleToElement(
      '.cdk-overlay-backdrop.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing',
      'visibility',
      'hidden'
    );
  }

  changeModalType(type: string) {
    this.modalType = type;
  }

  onLogout() {
    this.userService
      .logout()
      .pipe(take(1))
      .subscribe((user) => {
        if (this.loggedInUser && this.loggedInUser.id) this.socialSignOut();
        this.loggedInUser = null;
        this.cdr.detectChanges();
        this.router.navigate(['/stay']);
      });
  }

  socialSignOut(): void {
    this.authService.signOut();
  }

  onOpenDatePicker() {
    let str = this.startDate ? 'check-out' : 'check-in';
    // this.setCurrSearch(str);
  }
  setSearchParams(ev: any) {
    ev.stopPropagation();
    this.setLoc();

    this.searchSubject$.next();
  }
}
