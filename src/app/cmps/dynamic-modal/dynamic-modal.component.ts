import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dynamic-modal',
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.scss'],
})
export class DynamicModalComponent {
  @Input() title!: string;
  @Output() closeModal = new EventEmitter();
  handleCLick(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }

  onCloseModal() {
    this.closeModal.emit();
  }
}
