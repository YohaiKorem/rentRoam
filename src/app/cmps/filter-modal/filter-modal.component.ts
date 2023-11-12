import {
  Component,
  ViewChild,
  ElementRef,
  Renderer2,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { StayService } from 'src/app/services/stay.service';

import { Stay, StayFilter, Amenities } from 'src/app/models/stay.model';
import { Btn } from 'src/app/models/btn.model';
import { ChartDataValue } from 'src/app/models/chartDataValue.model';
import { TrackByService } from 'src/app/services/track-by.service';
@Component({
  selector: 'filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent {
  constructor(
    private stayService: StayService,
    public trackByService: TrackByService
  ) {}
  @Input() stays!: Stay[] | null;
  @Input() nights!: number | null;
  @Output() closeModal = new EventEmitter();

  @ViewChild('maxSlider') maxSlider: any;
  @ViewChild('minSlider') minSlider: any;
  stayFilter = {} as StayFilter;
  private filterSubject$ = new Subject<string>();
  private destroySubject$ = new Subject<null>();
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
  elMobileCloseBtn = document.querySelector('.dynamic-modal .btn-close');
  ngOnInit() {
    this.stayService.stayFilter$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((stayFilter) => {
        this.stayFilter = stayFilter;
      });

    this.filterSubject$
      .pipe(takeUntil(this.destroySubject$), debounceTime(500))
      .subscribe(() => {
        this.stayService.setFilter(this.stayFilter);
      });

    this.stayService.avgPrice$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((avgPrice) => {
        this.avgStayPricePerNight = avgPrice;
      });
    this.stayService.highestPrice$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((highestPrice) => {
        this.highestAvailablePrice = highestPrice;
        this.maxPrice = highestPrice;
      });
    this.stayService.lowestPrice$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((lowestPrice) => {
        this.lowestAvailablePrice = lowestPrice;
        this.minPrice = lowestPrice;
      });
    this.histogramData = this.generateHistogramData();
  }

  ngAfterViewInit() {
    if (this.elMobileCloseBtn)
      this.elMobileCloseBtn.classList.remove('hidden-on-mobile');
  }

  filterBeds(beds: any) {
    this.stayFilter.equipment.bedsNum = beds;
    this.stayService.setFilter(this.stayFilter);
  }

  filterBathrooms(bathrooms: any) {
    this.stayFilter.equipment.bathNum = bathrooms;

    this.stayService.setFilter(this.stayFilter);
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
    const priceRange = this.highestAvailablePrice - this.lowestAvailablePrice;
    const priceInterval = priceRange / 50;

    const histogramData: ChartDataValue[] = Array(50)
      .fill(0)
      .map((_, idx) => ({
        price: this.lowestAvailablePrice + idx * priceInterval,
        count: 0,
      }));
    const stays = this.stays;
    if (stays)
      stays.forEach((stay) => {
        const bucketIndex = Math.min(
          49,
          Math.floor((stay.price - this.lowestAvailablePrice) / priceInterval)
        );
        console.log('bucketIndex', bucketIndex);
        console.log('histogramData', histogramData);

        histogramData[bucketIndex].count++;
      });

    const maxCount = Math.max(...histogramData.map((data) => data.count));

    histogramData.forEach((data) => {
      data.normalizedHeight = Math.floor((data.count / maxCount) * 100);
    });

    console.log(histogramData);
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
    return (itemPercentage * range) / 100;
  }

  toggleFocus(ev: any) {
    ev.type === 'blur'
      ? ev.target.labels[0].classList.remove('focus')
      : ev.target.labels[0].classList.add('focus');
  }

  setFilter() {
    this.stayFilter.minPrice = this.minPrice;
    this.stayFilter.maxPrice = this.maxPrice;
    this.stayService.setFilter(this.stayFilter);
    this.onCloseModal();
  }

  toggleSuperHost() {
    this.stayFilter.superhost = !this.stayFilter.superhost;
    this.stayService.setFilter(this.stayFilter);
  }

  filterAmenities(amenity: string) {
    if (this.stayFilter.amenities.includes(amenity)) {
      this.stayFilter.amenities = this.stayFilter.amenities.filter(
        (a) => a !== amenity
      );
    } else {
      this.stayFilter.amenities.push(amenity);
    }
    this.stayService.setFilter(this.stayFilter);
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

  ngOnDestroy(): void {
    this.destroySubject$.next(null);
    this.destroySubject$.unsubscribe();
  }
}
