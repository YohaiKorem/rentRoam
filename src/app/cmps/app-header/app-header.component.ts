import { Component, ElementRef, ViewChild } from '@angular/core';
import { faAirbnb } from '@fortawesome/free-brands-svg-icons';
import { faSearch, faGlobe, faBars } from '@fortawesome/free-solid-svg-icons';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuTrigger } from '@angular/material/menu';

import { SharedService } from 'src/app/services/shared.service';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { Subject, takeUntil } from 'rxjs';
import { SearchParam } from 'src/app/models/stay.model';
import { StayService } from 'src/app/services/stay.service';
declare var google: any;
@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  host: {
    class: 'main-header ',
  },
})
export class AppHeaderComponent {
  @ViewChild('locMenuTrigger') locMenuTrigger!: MatMenuTrigger;
  @ViewChild('dateMenuTrigger') dateMenuTrigger!: MatMenuTrigger;
  @ViewChild('guestsMenuTrigger') guestsMenuTrigger!: MatMenuTrigger;
  @ViewChild('picker') picker!: MatDateRangePicker<any>;
  @ViewChild('inputField') inputField!: ElementRef;
  searchParam = {} as SearchParam;
  private searchSubject$ = new Subject<any>();
  private destroySubject$ = new Subject<null>();
  faAirbnb = faAirbnb;
  faSearch = faSearch;
  faGlobe = faGlobe;
  faBars = faBars;
  isSearchOpen: boolean = false;
  currSearch: string = '';
  locSearch: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  suggestions: any[] = [];
  autocompleteService: any;
  isMobile = window.innerWidth <= 780;
  constructor(
    private sharedService: SharedService,
    private stayService: StayService
  ) {}

  ngOnInit() {
    this.stayService.searchParams$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((searchParam) => (this.searchParam = searchParam));
  }
  ngAfterViewInit() {
    this.autocompleteService = new google.maps.places.AutocompleteService();
  }

  getSuggestions(event: any) {
    if (!event.target.value) {
      this.suggestions = [];
      return;
    }
    this.autocompleteService.getQueryPredictions(
      { input: this.locSearch },
      (predictions: any) => {
        this.suggestions = predictions;
      }
    );
  }

  openSearchMenuMobile() {
    this.sharedService.openSearchMenuMobile();
  }

  openFilterModal() {
    this.sharedService.openFilterModal();
  }

  openSearch(str: string) {
    this.isMobile
      ? this.openSearchMenuMobile()
      : this.sharedService.openSearchMenu();
    this.isSearchOpen = true;
    this.setCurrSearch(str);
  }
  setCurrSearch(str: string) {
    if (str === 'loc') {
      this.guestsMenuTrigger.closeMenu();
      this.locMenuTrigger.openMenu();
    } else if (str === 'check-in' || str === 'check-out') {
      this.guestsMenuTrigger.closeMenu();
      this.locMenuTrigger.closeMenu();
    } else if (str === 'guests') {
      this.locMenuTrigger.closeMenu();
      this.guestsMenuTrigger.openMenu();
      document.querySelector('.cdk-overlay-connected-position-bounding-box');
    }
    this.currSearch = str;
  }

  autoComplete() {
    if (!this.locSearch) return;

    let inputElement = document.querySelector(
      '.search-loc-input'
    ) as HTMLInputElement;
    let autocomplete = new google.maps.places.Autocomplete(inputElement);
  }

  onCloseMenu() {
    this.setCurrSearch('');
  }
  test(ev: any) {
    console.log(ev);
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

  closeSearch() {
    this.isSearchOpen = false;
    this.onCloseMenu();
  }

  setLoc() {
    this.searchParam.location.name = this.locSearch;
  }

  onOpenDatePicker() {
    let str = this.startDate ? 'check-out' : 'check-in';
    this.setCurrSearch(str);
  }
  setSearchParams(ev: any) {
    ev.stopPropagation();
    this.setLoc();

    this.stayService.setSearchParams(this.searchParam);
  }
  ngOnDestroy(): void {
    this.destroySubject$.next(null);
    this.destroySubject$.unsubscribe();
  }
}
