import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { SharedService } from 'src/app/services/shared.service';
import { Unsub } from 'src/app/services/unsub.class';
import { UserService } from 'src/app/services/user.service';
import { WishlistService } from 'src/app/services/wishlist.service';
@Component({
  selector: 'wishlist-index',
  templateUrl: './wishlist-Index.component.html',
  styleUrls: ['./wishlist-Index.component.scss'],
})
export class WishlistIndexComponent extends Unsub implements OnInit {
  elHeader = document.querySelector('.main-header');
  isEditMode: boolean = false;
  loggedInUser: User | null = null;
  loggedInUser$!: Observable<User>;
  constructor(
    private userService: UserService,
    private wishlistService: WishlistService,
    private userSerivce: UserService,
    private sharedService: SharedService,

    private cdr: ChangeDetectorRef
  ) {
    super();
  }
  ngOnInit(): void {
    this.userService.loggedInUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => {
        this.loggedInUser = user;
      });
    this.sharedService.hideElementOnMobile('.main-header');
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    this.cdr.detectChanges();
  }
  removeWishlist(wishlistId: string) {
    this.userSerivce
      .removeWishlist(wishlistId, this.loggedInUser!)
      .pipe(tap((user: User) => (this.loggedInUser = user)));
  }
  override ngOnDestroy() {
    this.sharedService.showElementOnMobile('.main-header');
    super.ngOnDestroy();
  }
}
