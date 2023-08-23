import { Component, Input, OnInit } from '@angular/core';
import { Wishlist } from 'src/app/models/wishlist.model';
import { StayService } from 'src/app/services/stay.service';

@Component({
  selector: 'wishlist-preview',
  templateUrl: './wishlist-preview.component.html',
  styleUrls: ['./wishlist-preview.component.scss'],
})
export class WishlistPreviewComponent implements OnInit {
  constructor(private stayService: StayService) {}
  @Input() wishlist!: Wishlist;
  @Input() isModal: boolean = true;
  stayImgsForDisplay!: string[];

  ngOnInit(): void {}
}
