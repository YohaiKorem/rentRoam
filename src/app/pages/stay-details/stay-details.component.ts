import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, map } from 'rxjs';
import { Stay } from 'src/app/models/stay.model';
import { StayService } from 'src/app/services/stay.service';

@Component({
  selector: 'stay-details',
  templateUrl: './stay-details.component.html',
  styleUrls: ['./stay-details.component.scss'],
})
export class StayDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private stayService: StayService,
    public router: Router,
    private route: ActivatedRoute
  ) {}
  stay: Stay | null = null;
  stay$!: Observable<Stay>;
  res: any;
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.stay$ = this.route.data.pipe(
      map((data) => {
        this.stay = data['stay'];
        return data['stay'];
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
