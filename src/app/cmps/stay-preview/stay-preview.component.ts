import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { Observable, Subject, first, takeUntil } from 'rxjs';
import { SearchParam, Stay, StayDistance } from 'src/app/models/stay.model';
import { User } from 'src/app/models/user.model';
import { SharedService } from 'src/app/services/shared.service';
import { StayService } from 'src/app/services/stay.service';
import { UserService } from 'src/app/services/user.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'stay-preview',
  templateUrl: './stay-preview.component.html',
  styleUrls: ['./stay-preview.component.scss'],
})
export class StayPreviewComponent implements OnInit {
  @Input() stay!: Stay;
  @Input() areMonthsDifferent!: boolean;
  @Input() endMonth!: string;
  @Input() distances!: StayDistance[] | null;
  @Input() currDate: { start: Date; end: Date } = {
    start: new Date(),
    end: new Date(),
  };
  @Input() userLoc!: { lat: number | null; lng: number | null };

  private destroySubject$ = new Subject<null>();
  loggedInUser: User | null = null;
  loggedInUser$!: Observable<User>;
  isLoadingImg: boolean = true;
  isFirstElementInView = true;
  isLastElementInView = false;
  currImgUrlIdx = 0;
  searchParam = {} as SearchParam;
  distance: number | undefined = undefined;
  constructor(
    private stayService: StayService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private sharedService: SharedService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    this.checkInView();
    this.userService.loggedInUser$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((user) => {
        this.loggedInUser = user;
      });
  }

  isInWishlist() {
    return this.loggedInUser?.wishlists.some((wishlist) => {
      return wishlist.stays.some((stay) => stay._id === this.stay._id);
    });
  }

  onAddToWishlist(ev: any, id: string) {
    ev.stopPropagation();
    ev.preventDefault();
    this.isInWishlist()
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
    const updatedUser = this.userService.updateWishlistInUser(
      updatedWishlist,
      this.loggedInUser!
    );
    this.loggedInUser = updatedUser;
  }
  scrollToLeft(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.currImgUrlIdx =
      this.currImgUrlIdx === 0 ? this.currImgUrlIdx : this.currImgUrlIdx - 1;
    this.checkInView();
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
