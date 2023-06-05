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
  guestsNumForDisplay: number = 1;
  defaultDate = { start: new Date(), end: new Date() };
  isShowAllAmenities: boolean = false;
  selectedDate: any;
  ngOnInit(): void {
    this.stay$ = this.route.data.pipe(
      map((data) => {
        this.stay = data['stay'];

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
    if (!this.searchParam.location.name) {
      let { lat, lng } = this.stay?.loc!;

      if (this.stay?.loc.address)
        this.searchParam.location.name = this.stay?.loc.address;
      this.searchParam.location.coords = { lat, lng };
    }
  }

  updateGuestsNumForDisplay(searchParam: SearchParam) {
    let sum = 1;
    if (searchParam.guests.adults + searchParam.guests.children)
      sum = searchParam.guests.adults + searchParam.guests.children;
    this.guestsNumForDisplay = sum;
  }

  updateGuests(ev: any, num: number) {
    ev.stopPropagation();
    if (ev.target.className.includes('adults'))
      this.searchParam.guests.adults += num;
    if (ev.target.className.includes('children'))
      this.searchParam.guests.children += num;
    if (ev.target.className.includes('infants'))
      this.searchParam.guests.infants += num;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.searchParam.startDate = null;
    this.searchParam.endDate = null;
  }
}
