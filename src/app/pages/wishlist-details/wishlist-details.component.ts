import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Observable, Subscription, of, take, pipe } from 'rxjs';
import { Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
import { first, map, takeWhile } from 'rxjs/operators';
import { Wishlist } from 'src/app/models/wishlist.model';
import { WishlistService } from 'src/app/services/wishlist.service';
import { Stay } from 'src/app/models/stay.model';

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
    private location: Location
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
    console.log(this.wishlist);

    this.getStaysArrFromWishlist();
  }

  onBack() {
    this.location.back();
  }

  onEdit() {
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
    // Unsubscribe to avoid memory leaks
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }
}
