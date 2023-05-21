import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';
import { Stay } from 'src/app/models/stay.model';
import { StayService } from 'src/app/services/stay.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'stay-index',
  templateUrl: './stay-index.component.html',
  styleUrls: ['./stay-index.component.scss'],
})
export class StayIndexComponent implements OnInit {
  constructor(
    private stayService: StayService,
    private route: ActivatedRoute
  ) {}

  subscription!: Subscription;
  stays: Stay[] | null = null;
  stays$!: Observable<Stay[]>;
  isFilterModalOpen = false;
  ngOnInit() {
    this.stays$ = this.stayService.stays$;
  }

  toggleFilterModal() {
    this.isFilterModalOpen = !this.isFilterModalOpen;
    console.log(this.isFilterModalOpen);
  }
}
