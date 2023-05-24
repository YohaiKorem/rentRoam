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

import { Stay, StayFilter, amenities } from 'src/app/models/stay.model';
import { Btn } from 'src/app/models/btn.model';
import { ChartDataValue } from 'src/app/models/chartDataValue.model';
@Component({
  selector: 'filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent {
  constructor(private stayService: StayService) {}
  @Input() stays!: Stay[] | null;
  @Input() nights!: number | null;
  @ViewChild('maxSlider') maxSlider: any;
  @ViewChild('minSlider') minSlider: any;
  stayFilter = {} as StayFilter;
  private filterSubject$ = new Subject<string>();
  private destroySubject$ = new Subject<null>();
  lowestAvailablePrice: number = 1;
  highestAvailablePrice: number = 4000;
  minPrice: number = this.lowestAvailablePrice;
  maxPrice: number = this.highestAvailablePrice;
  value: number = 0;
  btnsArray = Btn.createArray(9, 'btn btn-form-filter', '');
  avgStayPricePerNight: number = 0;
  amenities = amenities;
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
  }

  filterBeds(beds: any) {
    this.stayFilter.equipment.bedsNum = beds;
    this.stayService.setFilter(this.stayFilter);
    console.log(this.priceCountMapForDisplay);
  }

  filterBathrooms(bathrooms: any) {
    this.stayFilter.equipment.bathNum = bathrooms;

    this.stayService.setFilter(this.stayFilter);
  }

  get stayPrices(): number[] {
    return this.stays?.map((stay) => stay.price)?.sort((a, b) => a - b) || [];
  }

  get priceCountMap(): any[] {
    const priceCountMap: { [key: number]: number } = {};
    this.stayPrices.forEach((price) => {
      if (price in priceCountMap) {
        priceCountMap[price]++;
      } else {
        priceCountMap[price] = 1;
      }
    });

    return Object.entries(priceCountMap).map(([price, count]) => ({
      price: Number(price),
      count,
    }));
  }

  get priceCountMapForDisplay(): ChartDataValue[] {
    const maxDisplayPrices =
      this.priceCountMap.length <= 50 ? this.priceCountMap.length : 50; // Maximum number of prices to display
    const countMap = this.priceCountMap.sort((a, b) => a.price - b.price);
    const groupSize = Math.floor(maxDisplayPrices / 3);
    const midStartIndex = Math.floor((countMap.length - groupSize) / 2);
    const lowPrices = countMap.slice(0, groupSize);
    const midPrices = countMap.slice(midStartIndex, midStartIndex + groupSize);
    const highPrices = countMap.slice(countMap.length - groupSize);
    const groupedPrices = [...lowPrices, ...midPrices, ...highPrices];
    return groupedPrices.sort((a, b) => a.price - b.price);
  }

  calculateSliderStep(): number {
    const range = this.highestAvailablePrice - this.lowestAvailablePrice;
    const itemCount = this.priceCountMapForDisplay.length;
    return Math.floor(range / itemCount);
  }

  getThumbLabelPosition(): number {
    const range = this.maxSlider - this.minSlider;
    console.log(this.priceCountMapForDisplay);

    const itemPercentage = (30 / this.priceCountMapForDisplay.length) * 100;
    console.log((itemPercentage * range) / 100);
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
    console.log(this.stayFilter);
  }

  ngOnDestroy(): void {
    this.destroySubject$.next(null);
    this.destroySubject$.unsubscribe();
  }
}
