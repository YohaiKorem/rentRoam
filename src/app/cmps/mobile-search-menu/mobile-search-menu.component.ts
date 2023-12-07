import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subject, takeUntil } from 'rxjs';
import { SearchParam } from 'src/app/models/stay.model';
import { AutoCompleteService } from 'src/app/services/auto-complete.service';
import { SharedService } from 'src/app/services/shared.service';
import { StayService } from 'src/app/services/stay.service';
import { TrackByService } from 'src/app/services/track-by.service';
import { Unsub } from 'src/app/services/unsub.class';
import { environment } from 'src/environments/environment';
declare var google: any;
@Component({
  selector: 'mobile-search-menu',
  templateUrl: './mobile-search-menu.component.html',
  styleUrls: ['./mobile-search-menu.component.scss'],
})
export class MobileSearchMenuComponent extends Unsub implements OnInit {
  @ViewChild('locMenuTrigger') locMenuTrigger!: MatMenuTrigger;
  @ViewChild('guestsMenuTrigger') guestsMenuTrigger!: MatMenuTrigger;
  // @ViewChild('picker') picker!: MatDateRangePicker<any>;
  @Output() toggleSearchClosed = new EventEmitter();
  constructor(
    private sharedService: SharedService,
    private stayService: StayService,
    public trackByService: TrackByService,
    private autoCompleteService: AutoCompleteService
  ) {
    super();
  }
  isOpen: boolean = false;
  searchParam = {} as SearchParam;
  guestsNumStrForDisplay = '';
  currSearch: string = 'loc';
  locSearch: string = '';
  isLocSearchMenuOpen: boolean = false;
  startDate: Date | null = null;
  endDate: Date | null = null;
  suggestions: any[] = [];
  autoComplete: any;

  ngOnInit() {
    this.sharedService.openSearchMenuMobile$.subscribe(() => {
      this.toggleMenu();
    });
    this.stayService.searchParams$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((searchParam) => {
        this.searchParam = searchParam;
        this.updateGuestsNumForDisplay(this.searchParam);
      });
    this.autoCompleteService.apiLoaded$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((isLoaded) => {
        isLoaded
          ? (this.autoComplete = this.autoCompleteService.autoComplete)
          : (this.autoComplete = null);
      });
  }
  ngAfterViewInit() {}

  updateGuestsNumForDisplay(searchParam: SearchParam) {
    if (!searchParam || !searchParam.guests) return;
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
    } else if (str === 'dates') {
    } else if (str === 'guests') {
    }
    this.currSearch = str;
  }

  setDateRange(dateRange: any) {
    this.searchParam.startDate = dateRange.start;
    this.searchParam.endDate = dateRange.end;
  }

  onOpenDatePicker() {
    let str = 'dates';
    this.setCurrSearch(str);
  }

  toggleLocSearchMenu() {
    this.isLocSearchMenuOpen = !this.isLocSearchMenuOpen;
  }

  getSuggestions(event: any) {
    if (!event.target.value || !this.autoComplete) {
      this.suggestions = [];
      return;
    }
    this.autoCompleteService.autoComplete.getQueryPredictions(
      { input: this.locSearch },
      (predictions: any) => {
        this.suggestions = predictions;
      }
    );
  }

  locSelected(loc: any) {
    this.locSearch = loc.description;
    this.isLocSearchMenuOpen = false;
  }

  // autoComplete() {
  //   if (!this.locSearch) return;

  //   let inputElement = document.querySelector(
  //     '.search-loc-input'
  //   ) as HTMLInputElement;
  //   let autocomplete = new google.maps.places.Autocomplete(inputElement);
  // }

  setLoc() {
    this.searchParam.location.name = this.locSearch;
  }

  setSearchParams(ev: any) {
    ev.stopPropagation();
    this.setLoc();
    this.stayService.setSearchParams(this.searchParam);
    this.sharedService.openSearchMenuMobile();
  }
  updateGuests(ev: any, num: number, guestType: string) {
    ev.stopPropagation();
    switch (guestType) {
      case 'adults':
        this.searchParam.guests.adults += num;
        break;
      case 'children':
        this.searchParam.guests.children += num;
        break;
      case 'infants':
        this.searchParam.guests.infants += num;
        break;
      default:
        break;
    }
    this.updateGuestsNumForDisplay(this.searchParam);
  }

  clearSearch() {
    this.searchParam.startDate = null;
    this.searchParam.endDate = null;
    this.searchParam.location.name = '';
    for (const guestType in this.searchParam.guests) {
      this.searchParam.guests[guestType] = 0;
    }
  }

  onCloseMenu() {
    this.setCurrSearch('');
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) this.toggleSearchClosed.emit();
  }
}
