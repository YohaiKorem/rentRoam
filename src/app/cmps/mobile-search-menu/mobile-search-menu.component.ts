import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SearchParam } from 'src/app/models/stay.model';
import { SharedService } from 'src/app/services/shared.service';
import { StayService } from 'src/app/services/stay.service';

@Component({
  selector: 'mobile-search-menu',
  templateUrl: './mobile-search-menu.component.html',
  styleUrls: ['./mobile-search-menu.component.scss'],
})
export class MobileSearchMenuComponent implements OnInit {
  @Output() toggleSearchClosed = new EventEmitter();
  constructor(
    private sharedService: SharedService,
    private stayService: StayService
  ) {}
  isOpen: boolean = false;
  searchParam!: SearchParam;
  private destroySubject$ = new Subject<null>();

  ngOnInit(): void {
    this.sharedService.openSearchMenu$.subscribe(() => {
      this.toggleMenu();
    });
    this.stayService.searchParams$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((searchParam) => (this.searchParam = searchParam));
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) this.toggleSearchClosed.emit();
    console.log(this.isOpen);
  }
}
