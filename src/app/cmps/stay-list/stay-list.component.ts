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
  @Input() areMonthsDifferent!: boolean;
  @Input() endMonth!: string;
  @Input() currDate!: { start: Date; end: Date };

  @Output() clearFilter = new EventEmitter();

  onClearFilter() {
    this.clearFilter.emit();
  }
  ngAfterViewInit() {}
}
