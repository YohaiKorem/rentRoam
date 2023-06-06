import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, map, takeUntil, Subject } from 'rxjs';
import { SearchParam, Stay } from 'src/app/models/stay.model';
import { StayService } from 'src/app/services/stay.service';

@Component({
  selector: 'stay-details',
  templateUrl: './stay-details.component.html',
  styleUrls: ['./stay-details.component.scss'],
})
export class StayDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('picker') picker!: MatDateRangePicker<any>;

  private destroySubject$ = new Subject<null>();
  private subscription: Subscription = new Subscription();
  constructor(
    private stayService: StayService,
    public router: Router,
    private route: ActivatedRoute
  ) {}
  stay: Stay | null = null;
  stay$!: Observable<Stay>;
  res: any;
  searchParam = {} as SearchParam;
  startDate: Date | null = null;
  endDate: Date | null = null;
  nightSum = 5;
  guestsNumForDisplay: string = '1 guest';
  defaultDate = { start: new Date(), end: new Date() };
  isShowModal: boolean = false;
  selectedDate: any;
  center!: google.maps.LatLngLiteral;
  display!: google.maps.LatLngLiteral;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
  };
  currModalContent = {
    title: '',
    cmp: '',
  };

  homeIcon: google.maps.Icon = {
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" role="presentation" focusable="false" style="display: block; height: 52px; width: 52px;"><circle cx="26" cy="26" r="26" fill="%23DA0A64"/><path transform="translate(10,8.5)" d="m16.8 3.78 1.6 1.34 14.3 13.82-1.4 1.44L28 15.5v13.5a1 1 0 0 1-.82 1H20V19a1 1 0 0 0-.82-1H13a1 1 0 0 0-1 .82V30H5a1 1 0 0 1-1-.82V15.5L1.7 16.38l-1.4-1.44L15.2 3.7a2 2 0 0 1 1.6-.92z" fill="%23ffffff"/></svg>',
    scaledSize: new google.maps.Size(42, 42),
  };

  ngOnInit(): void {
    this.stay$ = this.route.data.pipe(
      map((data) => {
        this.stay = data['stay'];
        this.center = {
          lat: this.stay?.loc.lat!,
          lng: this.stay?.loc.lng!,
        };
        return data['stay'];
      })
    );
    this.stayService.searchParams$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((searchParam) => {
        this.searchParam = searchParam;
        this.updateGuestsNumForDisplay(this.searchParam);

        this.setDefaultLoc();
      });
    this.setDefaultDates();
  }

  ngAfterViewInit() {
    console.log(this.stay?.amenities);
  }

  getUserJoinDate(objectId: string) {
    const timestamp = Math.floor(parseInt(objectId.substring(0, 8), 16) * 1000);
    return new Date(timestamp);
  }

  openModal(cmp: string) {
    switch (cmp) {
      case 'review-preview':
        this.currModalContent = { title: 'Review', cmp: 'review-preview' };
        // set selectedReview if needed
        break;
      case 'amenity-list':
        this.currModalContent = { title: 'Amenities', cmp: 'amenity-list' };
        break;
      // handle other cases here
    }
    this.isShowModal = true;
  }

  setDefaultDates() {
    if (!this.searchParam.startDate && !this.searchParam.endDate) {
      const currentDate = new Date();

      const startDate = new Date(
        currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
      );

      const endDate = new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000);

      this.defaultDate = {
        start: startDate,
        end: endDate,
      };
      this.searchParam.startDate = startDate;
      this.searchParam.endDate = endDate;
    }
  }

  setDefaultLoc() {
    if (!this.searchParam.location.name)
      this.searchParam.location.coords = this.center;
  }

  txtToggled() {
    console.log('hi');
  }

  updateGuestsNumForDisplay(searchParam: SearchParam) {
    let sum = 1;
    if (searchParam.guests.adults + searchParam.guests.children)
      sum = searchParam.guests.adults + searchParam.guests.children;
    let infantStr = '';
    if (searchParam.guests.infants) {
      infantStr =
        searchParam.guests.infants === 1
          ? `, ${1} infant`
          : `, ${searchParam.guests.infants} infants`;
    }

    let guestsStr = sum === 1 ? `${sum} guest` : `${sum} guests`;
    let strForDisplay = `${guestsStr}${infantStr}`;

    this.guestsNumForDisplay = strForDisplay;
  }

  updateGuests(ev: any, num: number) {
    ev.stopPropagation();
    if (ev.target.className.includes('adults'))
      this.searchParam.guests.adults += num;
    if (ev.target.className.includes('children'))
      this.searchParam.guests.children += num;
    if (ev.target.className.includes('infants'))
      this.searchParam.guests.infants += num;
    this.updateGuestsNumForDisplay(this.searchParam);
  }

  moveMap(event: google.maps.MapMouseEvent) {
    this.center = event.latLng!.toJSON();
  }

  move(event: google.maps.MapMouseEvent) {
    this.display = event.latLng!.toJSON();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.searchParam.startDate = null;
    this.searchParam.endDate = null;
  }
}
