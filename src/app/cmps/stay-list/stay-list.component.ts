import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Stay } from 'src/app/models/stay.model';

@Component({
  selector: 'stay-list',
  templateUrl: './stay-list.component.html',
  styleUrls: ['./stay-list.component.scss'],
})
export class StayListComponent {
  @Input() stays!: Stay[] | null;
  @Output() clearFilter = new EventEmitter();
  onClearFilter() {
    this.clearFilter.emit();
  }
}
