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
import { Subject } from 'rxjs';
import { StayService } from 'src/app/services/stay.service';

import { Stay, StayFilter, amenities } from 'src/app/models/stay.model';
import { Btn } from 'src/app/models/btn.model';
@Component({
  selector: 'filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent {
  constructor(private stayService: StayService) {}
  @Input() stays!: Stay[] | null;

  stayFilter = {} as StayFilter;
  private filterSubject$ = new Subject<string>();
  private destroySubject$ = new Subject<null>();
  minPrice: number = 10;
  maxPrice: number = 1000;
  currMaxPrice: number = 2000;
  value: number = 0;
  btnsArray = Btn.createArray(9, 'btn btn-form-filter', '');
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
  }

  filterBeds(beds: any) {
    this.stayFilter.equipment.bedsNum = beds;

    this.stayService.setFilter(this.stayFilter);
  }

  filterBathrooms(bathrooms: any) {
    this.stayFilter.equipment.bathNum = bathrooms;

    this.stayService.setFilter(this.stayFilter);
  }

  toggleFocus(ev: any) {
    ev.type === 'blur'
      ? ev.target.labels[0].classList.remove('focus')
      : ev.target.labels[0].classList.add('focus');
  }

  ngOnDestroy(): void {
    this.destroySubject$.next(null);
    this.destroySubject$.unsubscribe();
  }
}
