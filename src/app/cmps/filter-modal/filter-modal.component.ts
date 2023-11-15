import {
  Component,
  ViewChild,
  ElementRef,
  Renderer2,
  Output,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { StayService } from 'src/app/services/stay.service';

import { Stay, StayFilter, Amenities } from 'src/app/models/stay.model';
import { Btn } from 'src/app/models/btn.model';
import { ChartDataValue } from 'src/app/models/chartDataValue.model';
import { TrackByService } from 'src/app/services/track-by.service';
import { SharedService } from 'src/app/services/shared.service';
import { Unsub } from 'src/app/services/unsub.class';
@Component({
  selector: 'filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent extends Unsub implements OnInit {
  constructor(
    private stayService: StayService,
    public trackByService: TrackByService,
    public sharedService: SharedService
  ) {
    super();
  }
  @Input() stays!: Stay[] | null;
  @Input() nights!: number | null;
  @Output() closeModal = new EventEmitter();

  @ViewChild('maxSlider') maxSlider: any;
  @ViewChild('minSlider') minSlider: any;
  stayFilter = {} as StayFilter;
  private filterSubject$ = new Subject<void>();
  lowestAvailablePrice: number = 1;
  highestAvailablePrice: number = 4000;
  histogramData: ChartDataValue[] | null = null;
  maxHeight: number = 180;
  minPrice: number = this.lowestAvailablePrice;
  maxPrice: number = this.highestAvailablePrice;
  value: number = 0;
  btnsArray = Btn.createArray(9, 'btn btn-form-filter', '');
  avgStayPricePerNight: number = 0;
  amenities = Amenities;
  isShowAllAmenities: boolean = false;
  ngOnInit() {
    this.stayService.stayFilter$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((stayFilter) => {
        this.stayFilter = stayFilter;
      });

    this.filterSubject$
      .pipe(takeUntil(this.unsubscribe$), debounceTime(500))
      .subscribe(() => {
        this.stayService.setFilter(this.stayFilter);
        this.histogramData = this.generateHistogramData();
      });

    this.stayService.avgPrice$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((avgPrice) => {
        this.avgStayPricePerNight = avgPrice;
      });
    this.stayService.highestPrice$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((highestPrice) => {
        if (highestPrice === -Infinity) return;
        this.highestAvailablePrice = highestPrice;
        this.maxPrice = highestPrice;
      });
    this.stayService.lowestPrice$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((lowestPrice) => {
        if (lowestPrice === Infinity) return;

        this.lowestAvailablePrice = lowestPrice;
        this.minPrice = lowestPrice;
      });
    this.histogramData = this.generateHistogramData();
  }

  ngAfterViewInit() {
    this.sharedService.showElementOnMobile('.dynamic-modal .btn-close');
  }

  filterBeds(beds: any) {
    this.stayFilter.equipment.bedsNum = beds;
    // this.stayService.setFilter(this.stayFilter);
    this.filterSubject$.next();
  }

  filterBathrooms(bathrooms: any) {
    this.stayFilter.equipment.bathNum = bathrooms;

    // this.stayService.setFilter(this.stayFilter);
    this.filterSubject$.next();
  }

  debug(normalizedHeight: any) {
    console.log('normalizedHeight', normalizedHeight);
  }

  get stayPrices(): number[] {
    return this.stays?.map((stay) => stay.price)?.sort((a, b) => a - b) || [];
  }

  get maxHistogramCount(): number {
    return Math.max(...this.histogramData!.map((bucket) => bucket.count));
  }

  generateHistogramData(): ChartDataValue[] {
    if (!this.stays || !this.stays.length) return [];
    const stays = this.stays;

    const priceRange = this.highestAvailablePrice - this.lowestAvailablePrice;
    const bucketCount =
      this.stays.length > 1 ? Math.min(50, Math.max(10, this.stays.length)) : 1;
    const priceInterval = priceRange / bucketCount;

    const histogramData: ChartDataValue[] = Array(bucketCount)
      .fill(0)
      .map((_, idx) => ({
        price: this.lowestAvailablePrice + idx * priceInterval,
        count: 0,
      }));

    stays.forEach((stay) => {
      const bucketIndex =
        stays.length > 1
          ? Math.min(
              bucketCount - 1,
              Math.floor(
                (stay.price - this.lowestAvailablePrice) / priceInterval
              )
            )
          : 0;
      console.log('stay', stay);
      console.log('histogramData', histogramData);
      console.log('bucketIndex', bucketIndex);

      histogramData[bucketIndex].count++;
    });

    const maxCount = Math.max(...histogramData.map((data) => data.count));

    histogramData.forEach((data) => {
      data.normalizedHeight = Math.floor((data.count / maxCount) * 100);
    });

    return histogramData;
  }

  calculateSliderStep(): number {
    const range = this.highestAvailablePrice - this.lowestAvailablePrice;
    const itemCount = this.histogramData!.length;
    return Math.floor(range / itemCount);
  }

  getThumbLabelPosition(): number {
    const range = this.maxSlider - this.minSlider;

    const itemPercentage = (30 / this.histogramData!.length) * 100;
    this.setFilter(false);
    return (itemPercentage * range) / 100;
  }

  toggleFocus(ev: any) {
    ev.type === 'blur'
      ? ev.target.labels[0].classList.remove('focus')
      : ev.target.labels[0].classList.add('focus');
  }

  setFilter(shouldCloseModal: boolean = true) {
    this.stayFilter.minPrice = this.minPrice;
    this.stayFilter.maxPrice = this.maxPrice;
    // this.stayService.setFilter(this.stayFilter);
    this.filterSubject$.next();
    if (shouldCloseModal) this.onCloseModal();
  }

  toggleSuperHost() {
    this.stayFilter.superhost = !this.stayFilter.superhost;
    // this.stayService.setFilter(this.stayFilter);
    this.filterSubject$.next();
  }

  filterAmenities(amenity: string) {
    if (this.stayFilter.amenities.includes(amenity)) {
      this.stayFilter.amenities = this.stayFilter.amenities.filter(
        (a) => a !== amenity
      );
    } else {
      this.stayFilter.amenities.push(amenity);
    }
    // this.stayService.setFilter(this.stayFilter);
    this.filterSubject$.next();
  }

  toggleCheckbox(amenity: any) {
    let elAmenity: any = document.getElementById(amenity);
    elAmenity!.checked = !elAmenity!.checked;
  }

  clearFilter() {
    this.stayService.clearFilter();
    this.onCloseModal();
  }

  onCloseModal() {
    this.closeModal.emit();
  }

  override ngOnDestroy(): void {
    this.sharedService.hideElementOnMobile('.dynamic-modal .btn-close');
    super.ngOnDestroy();
  }
}
