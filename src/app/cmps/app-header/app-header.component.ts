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
import { UserService } from 'src/app/services/user.service.local';
import { User } from 'src/app/models/user.model';
import { Observable, Subscription, debounceTime, take } from 'rxjs';
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

declare var google: any;
@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  host: {
    class: 'main-header ',
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
  autocompleteService: any;
  isShowSignupModal: boolean = false;
  loggedInUser: User | null = null;
  loggedInUser$!: Observable<User>;
  isMobile = window.innerWidth <= 780;
  google: any;
  constructor(
    private sharedService: SharedService,
    private stayService: StayService,
    private userService: UserService,
    private authService: SocialAuthService,
    public trackByService: TrackByService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
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
      });

    this.userService.loggedInUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => {
        this.loggedInUser = user;
        if (this.loggedInUser != null) this.isShowSignupModal = false;
      });
    this.sharedService.toggleSignupModal$.subscribe(() => {
      this.isShowSignupModal = !this.isShowSignupModal;
    });
  }
  ngAfterViewInit() {
    this.autocompleteService = new google.maps.places.AutocompleteService();
  }

  getSuggestions(event: any) {
    if (!event.target.value) {
      this.suggestions = [];
      return;
    }
    this.autocompleteService.getQueryPredictions(
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
    this.isMobile
      ? this.openSearchMenuMobile()
      : this.sharedService.openSearchMenu();
    this.isSearchOpen = true;
    this.setCurrSearch(str);
  }
  setCurrSearch(str: string) {
    if (str === 'loc') {
      this.guestsMenuTrigger.closeMenu();
      this.locMenuTrigger.openMenu();
    } else if (str === 'check-in' || str === 'check-out') {
      this.guestsMenuTrigger.closeMenu();
      this.locMenuTrigger.closeMenu();
    } else if (str === 'guests') {
      this.locMenuTrigger.closeMenu();
      this.guestsMenuTrigger.openMenu();
      document.querySelector('.cdk-overlay-connected-position-bounding-box');
    }
    this.currSearch = str;
  }

  handleClickOutside(ev: any) {
    // this.inputField.nativeElement.focus();
  }

  autoComplete() {
    if (!this.locSearch) return;

    let inputElement = document.querySelector(
      '.search-loc-input'
    ) as HTMLInputElement;
    let autocomplete = new google.maps.places.Autocomplete(inputElement);
  }

  onCloseMenu() {
    this.setCurrSearch('');
  }
  test(ev: any) {
    console.log(ev);
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
    this.searchParam.startDate = null;
    this.searchParam.endDate = null;
    this.searchParam.location.name = null;
    this.searchParam.guests.adults = 0;
    this.searchParam.guests.children = 0;
    this.searchParam.guests.infants = 0;
    this.stayService.setSearchParams(this.searchParam);
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
    console.log('menu open');
  }

  doLogin() {
    this.isShowSignupModal = true;
  }

  doSignup() {
    this.isShowSignupModal = true;
  }

  onLogout() {
    this.loggedInUser = this.userService.logout();
    this.socialSignOut();
    this.router.navigate(['/stay']);
  }

  socialSignOut(): void {
    this.authService.signOut();
  }

  onOpenDatePicker() {
    let str = this.startDate ? 'check-out' : 'check-in';
    this.setCurrSearch(str);
  }
  setSearchParams(ev: any) {
    ev.stopPropagation();
    this.setLoc();

    this.searchSubject$.next();
  }
}
