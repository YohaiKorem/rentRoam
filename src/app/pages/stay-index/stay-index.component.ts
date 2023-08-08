import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { Observable, Subscription, map, Subject, takeUntil } from 'rxjs';
import { Stay } from 'src/app/models/stay.model';
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
  // @HostListener('window:scroll', ['$event']);
  constructor(
    private stayService: StayService,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) {}

  subscription!: Subscription;
  stays: Stay[] | null = null;
  stays$!: Observable<Stay[]>;
  isFilterModalOpen = false;
  location: any | null = null;
  private destroySubject$ = new Subject<null>();

  ngOnInit() {
    this.stays$ = this.stayService.stays$;
    this.sharedService.openFilterModal$.subscribe(() => {
      this.toggleFilterModal();
    });
    this.stayService.searchParams$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((searchParam) => (this.location = searchParam.location));
  }

  // onScroll(event: any) {
  //   // Get the scroll position
  //   const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

  //   // Calculate the new position for the parallax container
  //   const parallaxContainer = document.querySelector('.parallax-container');
  //   parallaxContainer.style.transform = `translateY(${scrollPosition * 0.5}px)`;
  // }

  clearFilter() {
    this.stayService.clearFilter();
  }

  toggleFilterModal() {
    this.isFilterModalOpen = !this.isFilterModalOpen;
    document.querySelector('body')?.classList.toggle('modal-open');
  }
}
