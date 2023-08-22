import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable, Subscription, map, Subject, takeUntil } from 'rxjs';
import { SearchParam, Stay } from 'src/app/models/stay.model';
import { StayService } from 'src/app/services/stay.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'stay-index',
  templateUrl: './stay-index.component.html',
  styleUrls: ['./stay-index.component.scss'],
})
export class StayIndexComponent implements OnInit {
  @Output() toggleScrolling = new EventEmitter<boolean>();

  constructor(
    private stayService: StayService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private elementRef: ElementRef
  ) {}

  subscription!: Subscription;
  stays: Stay[] | null = null;
  stays$!: Observable<Stay[]>;
  isFilterModalOpen = false;
  isWishlistModalOpen = false;
  isModalOpen: boolean = false;
  location: any | null = null;
  searchParam = {} as SearchParam;
  currDate = { start: new Date(), end: new Date() };
  distance: number = 0;
  userLoc: any = { lat: null, lng: null };
  modalTitle: string = '';
  private destroySubject$ = new Subject<null>();

  ngOnInit() {
    this.stays$ = this.stayService.stays$;
    this.setDefaultDates();
    this.sharedService.openModal$.subscribe((str) => {
      // this.toggleFilterModal();
      this.toggleModal(str);
    });
    this.stayService.searchParams$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((searchParam) => (this.location = searchParam.location));
  }

  clearFilter() {
    this.stayService.clearFilter();
  }

  toggleFilterModal() {
    this.isFilterModalOpen = !this.isFilterModalOpen;
    document.querySelector('body')?.classList.toggle('modal-open');
    this.isFilterModalOpen ? (this.modalTitle = 'Filters') : '';
  }

  toggleModal(title = '') {
    if (title) {
      this.modalTitle = title;
      this.isModalOpen = true;
      document.querySelector('body')?.classList.add('modal-open');
      return;
    }
    this.isModalOpen = false;
    document.querySelector('body')?.classList.remove('modal-open');
  }

  toggleWishlistModal() {}

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
}
