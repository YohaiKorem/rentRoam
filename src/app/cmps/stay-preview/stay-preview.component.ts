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
  constructor(
    private stayService: StayService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private sharedService: SharedService
  ) {
    // this.getUserLocation();
  }

  isFirstElementInView = true;
  isLastElementInView = false;
  currImgUrlIdx = 0;
  searchParam = {} as SearchParam;
  // currDate = { start: new Date(), end: new Date() };
  distance: number = 0;
  userLoc: any = { lat: null, lng: null };

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

  onAddToWishlist(ev: any, id: string) {
    ev.stopPropagation();
    ev.preventDefault();
    // this.loggedInUser?.wishlist.push(id);
    this.sharedService.openModal('wishlist');
    this.userService.toggleStayInWishlist(id, this.loggedInUser!);
  }

  scrollToLeft(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.currImgUrlIdx =
      this.currImgUrlIdx === 0 ? this.currImgUrlIdx : this.currImgUrlIdx - 1;
    this.checkInView();
  }

  onImgErr(ev: any) {
    ev.target.style.opacity = '0';
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
