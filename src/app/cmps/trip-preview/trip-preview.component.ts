import { Component, Input, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'trip-preview',
  templateUrl: './trip-preview.component.html',
  styleUrls: ['./trip-preview.component.scss'],
})
export class TripPreviewComponent implements OnInit {
  @Input() order!: Order;
  @Input() svg!: {
    pending: IconDefinition;
    approved: IconDefinition;
    declined: IconDefinition;
    [key: string]: any;
  };
  dateForDisplay: string = '';

  ngOnInit(): void {
    this.setDateForDisplay();
  }

  setDateForDisplay() {
    const startDate = new Date(this.order.checkin).toLocaleDateString('en-GB', {
      month: 'short',
      day: '2-digit',
    });
    const endDate = new Date(this.order.checkout).toLocaleDateString('en-GB', {
      month: 'short',
      day: '2-digit',
    });
    this.dateForDisplay = this.dateForDisplay.concat(startDate, '-', endDate);
  }
}
