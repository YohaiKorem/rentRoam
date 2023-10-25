import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { StayService } from 'src/app/services/stay.service';
import { take } from 'rxjs';
import { Stay } from 'src/app/models/stay.model';
import { TrackByService } from 'src/app/services/track-by.service';
@Component({
  selector: 'trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.scss'],
})
export class TripDetailsComponent implements OnInit {
  @Input() trip: Order | null = null;
  formattedDates!: { start: string; end: string };
  stay!: Stay;
  constructor(
    private stayService: StayService,
    public trackByService: TrackByService
  ) {}
  ngOnInit() {
    this.getStay();
    this.formattedDates = this.getFormattedDateForDisplay();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['trip']) {
      this.formattedDates = this.getFormattedDateForDisplay();
      this.getStay();
    }
  }

  getStay() {
    this.stayService
      .getStayById(this.trip?.stay._id!)
      .pipe(take(1))
      .subscribe((stay: Stay) => (this.stay = stay));
  }

  getFormattedDateForDisplay() {
    return {
      start: new Date(this.trip!.checkin).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      end: new Date(this.trip!.checkout).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    };
  }
}
