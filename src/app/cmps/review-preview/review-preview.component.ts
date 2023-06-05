import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Review } from 'src/app/models/review.model';

@Component({
  selector: 'review-preview',
  templateUrl: './review-preview.component.html',
  styleUrls: ['./review-preview.component.scss'],
})
export class ReviewPreviewComponent implements OnInit {
  @Input() review!: Review;
  // These inputs and outputs are used in cases where the parent component needs control over the text display state.
  // If 'independentToggling' is true (default), this component will manage the text display state independently.
  // If 'independentToggling' is false, this component will emit a 'txtToggled' event when the user tries to toggle the text.
  // In this case, the parent component should listen for the 'txtToggled' event and handle the text display state itself.
  // 'txtToggled' event does not carry any value; it merely signals the parent component that a toggle was attempted.
  @Input() independentToggling: boolean = true;
  @Output() txtToggled = new EventEmitter();
  dateForDisplay: any;
  showMore = false;
  ngOnInit(): void {
    this.dateForDisplay = new Date(
      Date.parse(this.review.at)
    ).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  }
  toggleShowMore() {
    this.independentToggling
      ? (this.showMore = !this.showMore)
      : this.txtToggled.emit();
  }
}
