import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Observable, Subscription, of, take, pipe } from 'rxjs';
import { Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
import { first, map, takeWhile } from 'rxjs/operators';
import { Wishlist } from 'src/app/models/wishlist.model';
import { WishlistService } from 'src/app/services/wishlist.service';
import { Stay } from 'src/app/models/stay.model';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'wishlist-details',
  templateUrl: './wishlist-details.component.html',
  styleUrls: ['./wishlist-details.component.scss'],
})
export class WishlistDetailsComponent implements OnInit, OnDestroy {
  user: User | null = null;
  user$!: Observable<User | null>;
  wishlist: Wishlist | undefined;
  wishlistId!: string;
  paramsSubscription!: Subscription;
  userSubscription!: Subscription;
  stays$!: Observable<Stay[]>;
  currDate = { start: new Date(), end: new Date() };
  isModalOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private wishlistService: WishlistService,
    private location: Location,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.route.data.subscribe((data) => {
      this.user = data['user'];
      this.user$ = of(this.user);
    });
    this.paramsSubscription = this.route.params.subscribe((val) => {
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
    this.sharedService.hideElementOnMobile('.main-header');

    this.getStaysArrFromWishlist();
  }

  ngAfterViewInit() {
    this.sharedService.loadGoogleMaps();

    document
      .querySelector('.stay-preview-container')
      ?.classList.add('inside-wishlist-details');
  }

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
  }

  getStaysArrFromWishlist() {
    if (this.wishlist)
      this.stays$ = this.wishlistService.getStaysArrFromWishlist(this.wishlist);
  }

  ngOnDestroy(): void {
    this.sharedService.showElementOnMobile('.main-header');
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    document
      .querySelector('.stay-preview-container')
      ?.classList.remove('inside-wishlist-details');
  }
}
