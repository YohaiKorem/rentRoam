import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.scss'],
})
export class TripDetailsComponent implements OnInit {
  @Input() trip: Order | null = null;
  formattedDates!: { start: string; end: string };

  ngOnInit() {
    this.formattedDates = this.getFormattedDateForDisplay();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['trip'])
      this.formattedDates = this.getFormattedDateForDisplay();
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
