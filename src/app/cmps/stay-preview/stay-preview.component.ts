import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, first, takeUntil, take } from 'rxjs';
import { SearchParam, Stay, StayDistance } from 'src/app/models/stay.model';
import { User } from 'src/app/models/user.model';
import { SharedService } from 'src/app/services/shared.service';
import { StayService } from 'src/app/services/stay.service';
import { TrackByService } from 'src/app/services/track-by.service';
import { Unsub } from 'src/app/services/unsub.class';
import { UserService } from 'src/app/services/user.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'stay-preview',
  templateUrl: './stay-preview.component.html',
  styleUrls: ['./stay-preview.component.scss'],
})
export class StayPreviewComponent
  extends Unsub
  implements OnInit, AfterViewInit
{
  @Input() stay!: Stay;
  @Input() areMonthsDifferent: boolean = false;
  @Input() endMonth: string = '';
  @Input() distances!: StayDistance[] | null;
  @Input() currDate: { start: Date; end: Date } = {
    start: new Date(),
    end: new Date(),
  };
  @Input() userLoc!: { lat: number | null; lng: number | null };

  loggedInUser: User | null = null;
  loggedInUser$!: Observable<User>;
  isLoadingImg: boolean = true;
  isFirstElementInView = true;
  isLastElementInView = false;
  currImgUrlIdx = 0;
  searchParam = {} as SearchParam;
  distance: number | undefined = undefined;
  isInWishlist!: boolean;
  constructor(
    private stayService: StayService,
    private cdr: ChangeDetectorRef,
    public router: Router,
    private activatedRoute: ActivatedRoute,

    private userService: UserService,
    private sharedService: SharedService,
    private wishlistService: WishlistService,
    public trackByService: TrackByService
  ) {
    super();
  }

  ngOnInit() {
    this.checkInView();
    this.userService.loggedInUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => {
        this.loggedInUser = user;
        this.setIsInWishlist(this.loggedInUser, this.stay);
        this.cdr.detectChanges();
      });
  }

  ngAfterViewInit() {
    this.setIsInWishlist();
  }

  setIsInWishlist(
    user: User | null = this.loggedInUser,
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

  onAddToWishlist(ev: any, id: string) {
    ev.stopPropagation();
    ev.preventDefault();
    if (!this.loggedInUser) {
      this.router.navigate(['/login'], {
        relativeTo: this.activatedRoute,
        queryParamsHandling: 'preserve',
      });
      return;
    }
    this.isInWishlist
      ? this.onRemoveFromWishlist()
      : this.sharedService.openModal('wishlist', this.stay);
  }
  onRemoveFromWishlist() {
    const wishlistIdx = this.loggedInUser?.wishlists.findIndex((wishlist) => {
      return wishlist.stays.some((s) => s._id === this.stay._id);
    });
    if (wishlistIdx === undefined) return;
    const wishlistToUpdate = this.loggedInUser?.wishlists[wishlistIdx];
    const updatedWishlist = this.wishlistService.toggleStayInWishlist(
      wishlistToUpdate!,
      this.stay
    );
    this.userService
      .updateWishlistInUser(updatedWishlist, this.loggedInUser!)
      .pipe(take(1))
      .subscribe((user: User) => (this.loggedInUser = user));
  }
  scrollToLeft(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.currImgUrlIdx =
      this.currImgUrlIdx === 0 ? this.currImgUrlIdx : this.currImgUrlIdx - 1;
    this.checkInView();
  }

  onSwipe(moveBy: number) {
    this.currImgUrlIdx += moveBy;
    if (this.currImgUrlIdx >= this.stay?.imgUrls.length!)
      this.currImgUrlIdx = 0;
    else if (this.currImgUrlIdx <= 0)
      this.currImgUrlIdx = this.stay?.imgUrls.length! - 1;
  }

  onHostImgErr(ev: any) {
    ev.target.style.opacity = '0';
  }

  onImageLoad() {
    this.isLoadingImg = false;
    this.setDistance();
  }

  onImageError() {
    this.isLoadingImg = false;
    this.setDistance();
  }

  setDistance() {
    if (this.distances === undefined) {
      setTimeout(this.setDistance, 1000);
      return;
    }
    const distanceItem = this.distances!.find((d) => d._id === this.stay._id);
    this.distance = distanceItem?.distance;
    this.stayService.searchParams$.pipe(first()).subscribe((searchParam) => {
      this.searchParam = searchParam;
      this.cdr.detectChanges();
    });
  }

  scrollToRight(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.currImgUrlIdx =
      this.currImgUrlIdx === this.stay.imgUrls.length - 1
        ? this.currImgUrlIdx
        : this.currImgUrlIdx + 1;
    this.checkInView();
  }

  checkInView() {
    this.isFirstElementInView = this.currImgUrlIdx === 0 ? true : false;
    this.isLastElementInView =
      this.currImgUrlIdx === this.stay?.imgUrls.length - 1 ? true : false;
  }
}
