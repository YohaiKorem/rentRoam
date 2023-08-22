import { Component, Input, OnInit } from '@angular/core';
import { StayService } from 'src/app/services/stay.service';

@Component({
  selector: 'wishlist-preview',
  templateUrl: './wishlist-preview.component.html',
  styleUrls: ['./wishlist-preview.component.scss'],
})
export class WishlistPreviewComponent implements OnInit {
  constructor(private stayService: StayService) {}
  @Input() wishlist!: any;
  stayImgsForDisplay!: string[];

  ngOnInit(): void {
    this.loadStayImages();
  }

  loadStayImages(): void {
    this.stayImgsForDisplay = [];

    this.wishlist.forEach((stayId: string) => {
      this.stayService.getStayById(stayId).subscribe((stay) => {
        this.stayImgsForDisplay.push(stay.imgUrls[0]);
      });
    });
  }
}
