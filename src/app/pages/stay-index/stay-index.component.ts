import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';
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
  constructor(
    private stayService: StayService,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) {}

  subscription!: Subscription;
  stays: Stay[] | null = null;
  stays$!: Observable<Stay[]>;
  isFilterModalOpen = false;
  ngOnInit() {
    this.stays$ = this.stayService.stays$;
    this.sharedService.openFilterModal$.subscribe(() => {
      this.toggleFilterModal();
    });
  }

  toggleFilterModal() {
    this.isFilterModalOpen = !this.isFilterModalOpen;
  }
}
