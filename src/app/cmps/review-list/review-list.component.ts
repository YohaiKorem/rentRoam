import { Component, Input } from '@angular/core';
import { Review } from 'src/app/models/review.model';
import { SharedService } from 'src/app/services/shared.service';
import { TrackByService } from 'src/app/services/track-by.service';

@Component({
  selector: 'review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss'],
})
export class ReviewListComponent {
  @Input() reviews!: Review[];
  @Input() isToggleEnabled: boolean = true;
  @Input() independentToggling: boolean = true;
  constructor(
    public trackByService: TrackByService,
    private sharedService: SharedService
  ) {}
  filterReviewsBy: string = '';
  filteredReviews: Review[] = this.reviews;

  ngOnInit() {
    this.sharedService.showElementOnMobile(
      'button.btn.btn-close.hidden-on-mobile'
    );
  }

  onFilterReviews(ev: any) {
    const regex = new RegExp(this.filterReviewsBy, 'i');
    let filteredReviews = this.reviews;
    if (!this.filterReviewsBy) return;
    filteredReviews = this.reviews.filter((review) => {
      return regex.test(review.txt);
    });

    this.filteredReviews = filteredReviews;
  }
}
