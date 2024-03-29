import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable, Subscription, of, Subject, takeUntil, take } from 'rxjs';
import {
  SearchParam,
  Stay,
  StayDistance,
  StayFilter,
} from 'src/app/models/stay.model';
import { StayService } from 'src/app/services/stay.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { Unsub } from 'src/app/services/unsub.class';

@Component({
  selector: 'stay-index',
  templateUrl: './stay-index.component.html',
  styleUrls: ['./stay-index.component.scss'],
})
export class StayIndexComponent extends Unsub implements OnInit {
  @Output() toggleScrolling = new EventEmitter<boolean>();

  constructor(
    private stayService: StayService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private userService: UserService,
    private elementRef: ElementRef
  ) {
    super();
  }

  subscription!: Subscription;
  stays: Stay[] | null = null;
  stays$!: Observable<Stay[]>;
  stayFilter: StayFilter | null = null;
  searchParam = {} as SearchParam;
  distances!: Observable<StayDistance[]>;
  isFilterModalOpen = false;
  isWishlistModalOpen = false;
  isModalOpen: boolean = false;
  searchedLocation: any | null = null;
  currDate = { start: new Date(), end: new Date() };
  userLoc: { lat: number | null; lng: number | null } = {
    lat: null,
    lng: null,
  };
  modalTitle: string = '';
  loggedInUser: User | null = null;
  loggedInUser$!: Observable<User>;
  selectedStay: Stay | null = null;

  ngOnInit() {
    this.stays$ = this.stayService.stays$;
    this.stayService.stays$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((stays) => {
        this.stays = stays;
      });
    this.distances = this.stayService.distances$;
    this.setDefaultDates();
    this.sharedService.openModal$.subscribe(({ str, data }) => {
      this.toggleModal(str, data);
    });

    this.stayService.stayFilter$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((stayFilter) => {
        this.stayFilter = stayFilter;
      });
    this.stayService.searchParams$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((searchParam) => {
        this.searchedLocation = searchParam.location;
        if (this.searchedLocation.name) this.setDistance();
      });
    this.userService.loggedInUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => (this.loggedInUser = user));
    this.userService.userCoords$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((coords) => {
        this.userLoc = coords;
        if (this.userLoc.lat !== null && this.userLoc.lng !== null)
          this.setDistance();
      });

    this.sharedService.toggleClassOnElement('radio-filter', 'hidden', 'remove');
  }

  clearFilter() {
    this.stayService.clearFilter();
  }

  setDistance() {
    if (!this.stays! || !this.stays.length) {
      console.log('Stays not available');
      return;
    }

    let targetCoords: { lat: number | null; lng: number | null } | null = null;

    if (this.searchedLocation && this.searchedLocation.coords) {
      targetCoords = this.searchedLocation.coords;
    } else if (
      this.userLoc &&
      this.userLoc.lat !== null &&
      this.userLoc.lng !== null
    ) {
      targetCoords = this.userLoc;
    }

    if (!targetCoords) {
      console.log('No location or userLoc available');
      return;
    }

    const distances = this.stays.map((stay) => {
      const distance = Math.ceil(
        this.stayService.getDistance(stay, targetCoords) / 1000
      );
      const _id = stay._id;
      return { _id, distance };
    });
    this.distances = of(distances);
  }

  toggleFilterModal() {
    this.isFilterModalOpen = !this.isFilterModalOpen;
    document.querySelector('body')?.classList.toggle('modal-open');
    this.isFilterModalOpen ? (this.modalTitle = 'Filters') : '';
  }

  toggleModal(title = '', data: Stay | null = null) {
    this.selectedStay = data;

    if (title) {
      this.modalTitle = title;
      this.isModalOpen = true;
      document.querySelector('body')?.classList.add('modal-open');
      return;
    }
    this.isModalOpen = false;
    document.querySelector('body')?.classList.remove('modal-open');
  }

  getModalTitle() {
    let res = '';
    if (this.modalTitle === 'Filters') res = 'Filters';
    if (this.modalTitle === 'wishlist') res = 'Your wishlists';
    if (this.modalTitle === 'wishlistEdit') res = 'Name this wishlist';
    return res;
  }

  setDefaultDates() {
    if (!this.searchParam.startDate && !this.searchParam.endDate) {
      const currentDate = new Date();

      const startDate = new Date(
        currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
      );

      const endDate = new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000);

      this.currDate = {
        start: startDate,
        end: endDate,
      };
      this.searchParam.startDate = startDate;
      this.searchParam.endDate = endDate;
      return;
    }
    this.currDate = {
      start: this.searchParam.startDate!,
      end: this.searchParam.endDate!,
    };
  }

  get areMonthsDifferent(): boolean {
    const startMonth = this.currDate.start.toLocaleDateString('en-GB', {
      month: 'short',
    });
    const endMonth = this.currDate.end.toLocaleDateString('en-GB', {
      month: 'short',
    });
    return startMonth !== endMonth;
  }

  get endMonth(): string {
    return this.currDate.end.toLocaleDateString('en-GB', { month: 'short' });
  }

  override ngOnDestroy() {
    this.sharedService.toggleClassOnElement('radio-filter', 'hidden', 'add');
    super.ngOnDestroy();
  }
}
