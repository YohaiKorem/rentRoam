import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Observable,
  map,
  take,
  takeUntil,
  debounceTime,
  switchMap,
  tap,
  of,
  forkJoin,
  combineLatest,
} from 'rxjs';
import { SearchParam, Stay } from 'src/app/models/stay.model';
import { StayService } from 'src/app/services/stay.service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { SharedService } from 'src/app/services/shared.service';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';
import { TrackByService } from 'src/app/services/track-by.service';
import { Unsub } from 'src/app/services/unsub.class';
import { MatMenuTrigger } from '@angular/material/menu';
declare var google: any;
@Component({
  selector: 'stay-details',
  templateUrl: './stay-details.component.html',
  styleUrls: ['./stay-details.component.scss'],
})
export class StayDetailsComponent extends Unsub implements OnInit {
  @ViewChild('picker') picker!: MatDateRangePicker<any>;
  @ViewChild('guestsMenuTrigger') guestsMenuTrigger!: MatMenuTrigger;

  constructor(
    private stayService: StayService,
    public router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private wishlistService: WishlistService,
    private orderService: OrderService,
    public trackByService: TrackByService
  ) {
    super();
  }
  searchParam!: SearchParam;
  searchParam$!: Observable<SearchParam>;

  currImgUrlIdx = 0;
  isMobile = window.innerWidth <= 780;
  isInWishlist!: boolean;
  stay: Stay | null = null;
  stay$!: Observable<Stay>;
  user: User | null = null;
  user$!: Observable<User | null>;
  currDate: Date = new Date();
  minEndDate: Date | null = null;
  nightSum: number = 5;
  guestsNumForDisplay: string = '1 guest';
  defaultDate = { start: new Date(), end: new Date() };
  isShowModal: boolean = false;
  selectedDate: any;
  hostDescShowMore: boolean = false;
  summaryShowMore: boolean = false;

  datePickerFilter = (d: Date | null): boolean => {
    const day = d || new Date();
    return day > new Date();
  };

  center!: google.maps.LatLngLiteral;
  display!: google.maps.LatLngLiteral;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
  };
  currModalContent = {
    title: '',
    cmp: '',
  };
  urlToShare: string = '';
  homeIcon: google.maps.Icon | null = null;
  ngOnInit(): void {
    this.user$ = this.userService.loggedInUser$;
    this.searchParam$ = this.stayService.searchParams$;
    this.activatedRoute.data
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((data) => {
          this.stay$ = of(data['stay']);

          return combineLatest({
            user: this.user$,
            stay: this.stay$,
          });
        })
      )
      .subscribe(({ user, stay }) => {
        this.stay = stay;
        this.user = user;
        this.center = {
          lat: this.stay.loc.lat,
          lng: this.stay.loc.lng,
        };
        this.setIsInWishlist(user, stay);
      });

    this.searchParam$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((searchParam: SearchParam) => {
        this.searchParam = searchParam;
        this.updateGuestsNumForDisplay(searchParam);
        this.setDefaultLoc();
        this.setDefaultDates();
      });

    this.sharedService.openModal$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.toggleModal('close');
      });
  }

  ngAfterViewInit() {
    this.homeIcon = {
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" role="presentation" focusable="false" style="display: block; height: 52px; width: 52px;"><circle cx="26" cy="26" r="26" fill="%23DA0A64"/><path transform="translate(10,8.5)" d="m16.8 3.78 1.6 1.34 14.3 13.82-1.4 1.44L28 15.5v13.5a1 1 0 0 1-.82 1H20V19a1 1 0 0 0-.82-1H13a1 1 0 0 0-1 .82V30H5a1 1 0 0 1-1-.82V15.5L1.7 16.38l-1.4-1.44L15.2 3.7a2 2 0 0 1 1.6-.92z" fill="%23ffffff"/></svg>',
      scaledSize: new google.maps.Size(42, 42),
    };
    this.sharedService.toggleClassOnElement(
      '.main-content',
      'map-active',
      'remove'
    );
    this.sharedService.toggleClassOnElement(
      'mobile-footer',
      'show-on-mobile',
      'remove'
    );
    this.sharedService.toggleClassOnElement('mobile-footer', 'hidden', 'add');
    this.sharedService.toggleClassOnElement('google-map-cmp', 'hidden', 'add');

    this.setIsInWishlist();

    this.cdr.detectChanges();

    this.sharedService.hideElementOnMobile('app-header');
  }

  setSearchParams() {
    this.stayService.setSearchParams(this.searchParam);
  }

  onDateChange(): void {
    this.setMinEndDate();
    this.validateDates();
    this.calculateNightSum();
  }
  validateDates(): void {
    if (this.searchParam.startDate && this.searchParam.endDate) {
      if (this.searchParam.endDate < this.minEndDate!) {
        this.searchParam.endDate = this.defaultDate.end;
      }
    }
  }
  calculateNightSum() {
    let startDate = this.searchParam.startDate;
    let endDate = this.searchParam.endDate;
    if (!startDate) startDate = this.defaultDate.start;
    if (!endDate) endDate = this.defaultDate.end;

    const timeDifference = endDate.getTime() - startDate.getTime();
    this.nightSum = Math.ceil(timeDifference / (1000 * 3600 * 24));
    this.cdr.detectChanges();
  }

  setMinEndDate(): void {
    if (this.searchParam.startDate) {
      const startDate = new Date(this.searchParam.startDate);
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() + 1);
      this.minEndDate = startDate;
    }
  }

  getUserJoinDate(objectId: string) {
    const timestamp = Math.floor(parseInt(objectId.substring(0, 8), 16) * 1000);
    return new Date(timestamp);
  }

  setIsInWishlist(
    user: User | null = this.user,
    stay: Stay | null = this.stay
  ) {
    if (!stay) return;
    this.isInWishlist = !user
      ? false
      : user.wishlists.some((wishlist) => {
          return wishlist.stays.some((_stay) => {
            return _stay._id === stay._id;
          });
        });
  }

  onRemoveFromWishlist() {
    const wishlistIdx = this.user?.wishlists.findIndex((wishlist) => {
      return wishlist.stays.some((s) => s._id === this.stay!._id);
    });
    if (wishlistIdx === undefined) return;
    const wishlistToUpdate = this.user?.wishlists[wishlistIdx];
    const updatedWishlist = this.wishlistService.toggleStayInWishlist(
      wishlistToUpdate!,
      this.stay!
    );
    this.userService
      .updateWishlistInUser(updatedWishlist, this.user!)
      .pipe(tap((user: User) => (this.user = user)));
  }

  toggleModal(cmp: string) {
    switch (cmp) {
      case 'review-preview':
        this.currModalContent = { title: 'Review', cmp: 'review-preview' };
        break;
      case 'amenity-list':
        this.currModalContent = { title: 'Amenities', cmp: 'amenity-list' };
        break;
      case 'share':
        this.currModalContent = {
          title: 'Share this place',
          cmp: 'share-modal',
        };
        break;
      case 'save':
        this.currModalContent = {
          title: 'Your wishlists',
          cmp: 'wishlist-list',
        };
        break;
      case 'edit':
        this.currModalContent = {
          title: 'Name this wishlist',
          cmp: 'wishlist-edit',
        };
        break;
      case 'close':
        this.isShowModal = false;
        return;
    }

    this.isShowModal = true;
  }

  setDefaultDates() {
    if (
      this.searchParam &&
      !this.searchParam.startDate &&
      !this.searchParam.endDate
    ) {
      const currentDate = this.currDate;

      const startDate = new Date(
        currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
      );

      const endDate = new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000);

      this.defaultDate = {
        start: startDate,
        end: endDate,
      };
      this.searchParam.startDate = startDate;
      this.searchParam.endDate = endDate;
    }
  }

  onAddToWishlist() {
    if (!this.user) {
      this.router.navigate(['/login'], {
        relativeTo: this.activatedRoute,
        queryParamsHandling: 'preserve',
      });
      return;
    }
    this.isInWishlist ? this.onRemoveFromWishlist() : this.toggleModal('save');
  }

  setDateRange(dateRange: any) {
    this.searchParam.startDate = dateRange.start;
    this.searchParam.endDate = dateRange.end;
    this.setSearchParams();
    // this._searchParamSubject$.next(this.searchParam);
  }

  setDefaultLoc() {
    if (!this.searchParam || !this.searchParam.location) return;
    if (!this.searchParam.location.name)
      this.searchParam.location.coords = this.center;
  }

  onSwipe(moveBy: number) {
    this.currImgUrlIdx += moveBy;
    if (this.currImgUrlIdx >= this.stay?.imgUrls.length!)
      this.currImgUrlIdx = 0;
    else if (this.currImgUrlIdx <= 0)
      this.currImgUrlIdx = this.stay?.imgUrls.length! - 1;
  }

  toggleHostDescShowMore() {
    this.hostDescShowMore = true;
  }
  toggleSummaryShowMore() {
    this.summaryShowMore = true;
  }

  handleGuestMenuTrigger(action: string) {
    action === 'open'
      ? this.sharedService.toggleClassOnElement(
          '.cdk-overlay-backdrop',
          'visible',
          'add'
        )
      : this.sharedService.toggleClassOnElement(
          '.cdk-overlay-backdrop',
          'visible',
          'remove'
        );
  }

  updateGuestsNumForDisplay(searchParam: SearchParam) {
    if (!searchParam || !searchParam.guests) return;

    let sum = 1;
    if (searchParam.guests.adults + searchParam.guests.children)
      sum = searchParam.guests.adults + searchParam.guests.children;
    let infantStr = '';
    if (searchParam.guests.infants) {
      infantStr =
        searchParam.guests.infants === 1
          ? `, ${1} infant`
          : `, ${searchParam.guests.infants} infants`;
    }

    let guestsStr = sum === 1 ? `${sum} guest` : `${sum} guests`;
    let strForDisplay = `${guestsStr}${infantStr}`;

    this.guestsNumForDisplay = strForDisplay;
    this.searchParam.guests.adults = 1;
  }

  updateGuests(ev: any, num: number) {
    ev.stopPropagation();
    if (ev.target.className.includes('adults'))
      this.searchParam.guests.adults += num;
    if (ev.target.className.includes('children'))
      this.searchParam.guests.children += num;
    if (ev.target.className.includes('infants'))
      this.searchParam.guests.infants += num;
    this.updateGuestsNumForDisplay(this.searchParam);
  }

  onReserve() {
    if (
      !this.user ||
      !this.stay ||
      !this.searchParam.startDate ||
      !this.searchParam.endDate
    ) {
      this.router.navigate(['/login'], {
        relativeTo: this.activatedRoute,
        queryParamsHandling: 'preserve',
      });
      return;
    }

    const order = Order.createOrderFromInput(
      this.user,
      this.stay,
      this.searchParam
    );
    const newOrder = this.orderService.saveOrder(order);
    newOrder.pipe(take(1)).subscribe((order: Order) => {
      this.router.navigateByUrl(`/book/${order._id}`);
    });
  }

  moveMap(event: google.maps.MapMouseEvent) {
    this.center = event.latLng!.toJSON();
  }

  move(event: google.maps.MapMouseEvent) {
    this.display = event.latLng!.toJSON();
  }

  override ngOnDestroy(): void {
    this.sharedService.toggleClassOnElement(
      'mobile-footer',
      'show-on-mobile',
      'add'
    );
    this.sharedService.toggleClassOnElement(
      'mobile-footer',
      'hidden',
      'remove'
    );
    this.sharedService.toggleClassOnElement(
      'google-map-cmp',
      'hidden',
      'remove'
    );

    this.sharedService.showElementOnMobile('app-header');
    this.sharedService.showElementOnMobile('mobile-footer');
    super.ngOnDestroy();
  }
}
