import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SearchParam, Stay } from 'src/app/models/stay.model';
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
  @Input() currDate!: { start: Date; end: Date };
  private destroySubject$ = new Subject<null>();
  loggedInUser: User | null = null;
  loggedInUser$!: Observable<User>;
  isLoadingImg: boolean = true;
  isFirstElementInView = true;
  isLastElementInView = false;
  currImgUrlIdx = 0;
  searchParam = {} as SearchParam;
  distance: number = 0;
  userLoc: any = { lat: null, lng: null };
  constructor(
    private stayService: StayService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private sharedService: SharedService,
    private wishlistService: WishlistService
  ) {
    // this.getUserLocation();
  }

  ngOnInit() {
    this.checkInView();
    this.userService.loggedInUser$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((user) => {
        this.loggedInUser = user;
      });
  }

  // ngAfterViewInit() {
  //   this.getUserLocation();
  // }

  // setDistance() {
  //   if (this.searchParam.location) {
  //     let { lat, lng } = this.searchParam.location?.coords;
  //     if (lng && lat)
  //       this.distance = this.stayService.getDistance(
  //         this.stay,
  //         this.searchParam.location.coords
  //       );
  //     return;
  //   }
  //   this.distance = this.stayService.getDistance(this.stay, this.userLoc);
  //   console.log(this.distance);
  // }

  // getUserLocation() {
  //   if (navigator.geolocation) {
  //     setInterval(
  //       () =>
  //         navigator.geolocation.getCurrentPosition(
  //           (position) => {
  //             this.userLoc.lat = position.coords.latitude;
  //             this.userLoc.lng = position.coords.longitude;
  //           },
  //           () => {
  //             console.error('Error obtaining geolocation');
  //           }
  //         ),
  //       5000
  //     );
  //   } else {
  //     console.error('Browser does not support geolocation');
  //   }
  //   // this.setDistance();
  // }

  isInWishlist() {
    return this.loggedInUser?.wishlists.some((wishlist) => {
      return wishlist.stays.some((stay) => stay._id === this.stay._id);
    });
  }

  onAddToWishlist(ev: any, id: string) {
    ev.stopPropagation();
    ev.preventDefault();
    // this.loggedInUser?.wishlist.push(id);
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
    let els = document.querySelectorAll('.stay-preview-container .hidden');
    console.log(els);
  }

  onImageError() {
    this.isLoadingImg = false;
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
