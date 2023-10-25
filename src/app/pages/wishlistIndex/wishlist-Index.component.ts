import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { WishlistService } from 'src/app/services/wishlist.service';
@Component({
  selector: 'wishlist-index',
  templateUrl: './wishlist-Index.component.html',
  styleUrls: ['./wishlist-Index.component.scss'],
})
export class WishlistIndexComponent implements OnInit {
  private destroySubject$ = new Subject<null>();
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
  ) {}
  ngOnInit(): void {
    this.userService.loggedInUser$
      .pipe(takeUntil(this.destroySubject$))
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
    this.loggedInUser = this.userSerivce.removeWishlist(
      wishlistId,
      this.loggedInUser!
    );
  }
  ngOnDestroy() {
    this.sharedService.showElementOnMobile('.main-header');
  }
}
