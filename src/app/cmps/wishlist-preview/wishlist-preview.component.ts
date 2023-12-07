import { Component, Input, OnInit } from '@angular/core';
import { Wishlist } from 'src/app/models/wishlist.model';
import { StayService } from 'src/app/services/stay.service';
import { TrackByService } from 'src/app/services/track-by.service';

@Component({
  selector: 'wishlist-preview',
  templateUrl: './wishlist-preview.component.html',
  styleUrls: ['./wishlist-preview.component.scss'],
})
export class WishlistPreviewComponent implements OnInit {
  constructor(
    private stayService: StayService,
    public trackByService: TrackByService
  ) {}
  @Input() wishlist!: Wishlist;
  @Input() isModal: boolean = true;
  stayImgsForDisplay!: string[];
  isShortList!: boolean;
  extraImgs: string[] | null = null;
  ngOnInit(): void {
    if (this.wishlist.stays.length <= 3) {
      this.isShortList = true;
      this.getImgsForShortList();
      return;
    }
    this.isShortList = false;
  }

  getImgsForShortList() {
    const stay = this.stayService.getStayById(this.wishlist.stays[0]._id);
    stay.subscribe((stay) => (this.extraImgs = stay.imgUrls));
  }
}
