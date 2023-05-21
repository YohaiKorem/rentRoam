import { Component, Input } from '@angular/core';

@Component({
  selector: 'dynamic-modal',
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.scss'],
})
export class DynamicModalComponent {
  @Input() title!: string;
  handleCLick(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }
}
