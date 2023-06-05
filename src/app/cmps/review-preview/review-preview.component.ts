import { Component, Input } from '@angular/core';
import { Review } from 'src/app/models/review.model';

@Component({
  selector: 'review-preview',
  templateUrl: './review-preview.component.html',
  styleUrls: ['./review-preview.component.scss'],
})
export class ReviewPreviewComponent {
  @Input() review!: Review;
}
