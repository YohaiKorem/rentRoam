import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subject, takeUntil } from 'rxjs';
import { SearchParam } from 'src/app/models/stay.model';
import { SharedService } from 'src/app/services/shared.service';
import { StayService } from 'src/app/services/stay.service';

@Component({
  selector: 'mobile-search-menu',
  templateUrl: './mobile-search-menu.component.html',
  styleUrls: ['./mobile-search-menu.component.scss'],
})
export class MobileSearchMenuComponent implements OnInit, OnDestroy {
  @ViewChild('locMenuTrigger') locMenuTrigger!: MatMenuTrigger;
  @ViewChild('dateMenuTrigger') dateMenuTrigger!: MatMenuTrigger;
  @ViewChild('guestsMenuTrigger') guestsMenuTrigger!: MatMenuTrigger;
  @Output() toggleSearchClosed = new EventEmitter();
  constructor(
    private sharedService: SharedService,
    private stayService: StayService
  ) {}
  isOpen: boolean = false;
  searchParam = {} as SearchParam;
  guestsNumStrForDisplay = '';
  currSearch: string = 'dates';
  locSearch: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  suggestions: any[] = [];
  autocompleteService: any;
  private destroySubject$ = new Subject<null>();

  ngOnInit(): void {
    this.sharedService.openSearchMenuMobile$.subscribe(() => {
      this.toggleMenu();
    });
    this.stayService.searchParams$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((searchParam) => {
        this.searchParam = searchParam;
        this.updateGuestsNumForDisplay(this.searchParam);
      });
  }

  updateGuestsNumForDisplay(searchParam: SearchParam) {
    let sum = 0;
    if (searchParam.guests.adults + searchParam.guests.children)
      sum = searchParam.guests.adults + searchParam.guests.children;

    if (!sum) {
      this.guestsNumStrForDisplay = 'Add guests';
      return;
    }
    let infantStr = '';
    if (searchParam.guests.infants) {
      infantStr =
        searchParam.guests.infants === 1
          ? `, ${1} infant`
          : `, ${searchParam.guests.infants} infants`;
    }

    let guestsStr = sum === 1 ? `${sum} guest` : `${sum} guests`;
    let strForDisplay = `${guestsStr}${infantStr}`;

    this.guestsNumStrForDisplay = strForDisplay;
  }

  setCurrSearch(str: string) {
    if (str === 'loc') {
      console.log(str);
    } else if (str === 'dates') {
      console.log(str);
    } else if (str === 'guests') {
      console.log(str);
    }
    this.currSearch = str;
  }

  onOpenDatePicker() {
    let str = 'dates';
    this.setCurrSearch(str);
  }

  autoComplete() {
    if (!this.locSearch) return;

    let inputElement = document.querySelector(
      '.search-loc-input'
    ) as HTMLInputElement;
    let autocomplete = new google.maps.places.Autocomplete(inputElement);
  }

  setLoc() {
    this.searchParam.location.name = this.locSearch;
  }

  setSearchParams(ev: any) {
    ev.stopPropagation();
    this.setLoc();

    this.stayService.setSearchParams(this.searchParam);
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

  onCloseMenu() {
    this.setCurrSearch('');
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) this.toggleSearchClosed.emit();
    console.log(this.isOpen ? 'search open' : 'search closed');
  }
  ngOnDestroy(): void {
    this.destroySubject$.next(null);
    this.destroySubject$.unsubscribe();
  }
}
