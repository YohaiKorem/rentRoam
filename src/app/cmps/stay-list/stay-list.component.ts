import {
  Component,
  EventEmitter,
  Input,
  Output,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Stay } from 'src/app/models/stay.model';

@Component({
  selector: 'stay-list',
  templateUrl: './stay-list.component.html',
  styleUrls: ['./stay-list.component.scss'],
})
export class StayListComponent {
  constructor(private elementRef: ElementRef) {}
  @Input() stays!: Stay[] | null;
  @Input() distances!: { _id: string; distance: number }[];
  @Input() userLoc!: { lat: number | null; lng: number | null };
  @Input() areMonthsDifferent!: boolean;
  @Input() endMonth!: string;
  @Input() currDate!: { start: Date; end: Date };
  @Output() clearFilter = new EventEmitter();
  staysWithDistance: any;

  onClearFilter() {
    this.clearFilter.emit();
  }
  ngAfterViewInit() {
    let staysWithDistance = this.stays?.map((stay) => {
      const found = this.distances.find((s) => s._id === stay._id);
      return {
        ...stay,
        distance: found ? found.distance : null,
      };
    });
    this.staysWithDistance = staysWithDistance;
  }
}
