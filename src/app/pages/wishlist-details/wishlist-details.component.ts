import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Observable, Subscription, of, take, pipe, takeUntil } from 'rxjs';
import { Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
import { Wishlist } from 'src/app/models/wishlist.model';
import { WishlistService } from 'src/app/services/wishlist.service';
import { SearchParam, Stay, StayFilter } from 'src/app/models/stay.model';
import { SharedService } from 'src/app/services/shared.service';
import { Unsub } from 'src/app/services/unsub.class';
import { StayService } from 'src/app/services/stay.service';

@Component({
  selector: 'wishlist-details',
  templateUrl: './wishlist-details.component.html',
  styleUrls: ['./wishlist-details.component.scss'],
})
export class WishlistDetailsComponent extends Unsub implements OnInit {
  user: User | null = null;
  user$!: Observable<User | null>;
  wishlist: Wishlist | undefined;
  wishlistId!: string;
  stayFilter: StayFilter | null = null;
  searchParam = {} as SearchParam;

  paramsSubscription!: Subscription;
  userSubscription!: Subscription;
  stays$!: Observable<Stay[]>;
  currDate = { start: new Date(), end: new Date() };
  isModalOpen: boolean = false;
  isMobile: boolean = window.innerWidth < 780;
  constructor(
    private route: ActivatedRoute,
    private stayService: StayService,
    private wishlistService: WishlistService,
    private location: Location,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.userSubscription = this.route.data
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.user = data['user'];
        this.user$ = of(this.user);
      });
    this.paramsSubscription = this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        if (val && val['wishlistId']) {
          this.wishlistId = val['wishlistId'];
        }
      });
    if (this.user) {
      this.wishlist = this.wishlistService.findWishlist(
        this.user,
        this.wishlistId
      );
    }
    this.stayService.stayFilter$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((stayFilter) => {
        this.stayFilter = stayFilter;
      });
    this.stayService.searchParams$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((searchParam) => {
        this.searchParam = searchParam;
      });
    this.sharedService.hideElementOnMobile('.main-header');
    this.sharedService.hideElementOnMobile('mobile-footer');

    this.getStaysArrFromWishlist();
  }

  ngAfterViewInit() {}

  onBack() {
    this.location.back();
  }

  onEdit() {
    this.toggleModal();
  }

  recieveUserData(res: { user: User; wishlist: Wishlist }) {
    const { user, wishlist } = res;
    this.user = { ...user };
    this.wishlist = JSON.parse(JSON.stringify(wishlist));
    this.cdr.detectChanges();
    this.toggleModal();
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
    setTimeout(
      this.sharedService.showElementOnMobile,

      50,
      '.dynamic-modal header .btn-close'
    );
  }

  getStaysArrFromWishlist() {
    if (this.wishlist)
      this.stays$ = this.wishlistService.getStaysArrFromWishlist(this.wishlist);
  }

  override ngOnDestroy(): void {
    this.sharedService.showElementOnMobile('.main-header');
    this.sharedService.showElementOnMobile('mobile-footer');
  }
}
