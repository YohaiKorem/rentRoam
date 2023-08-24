import { Component, Input } from '@angular/core';

@Component({
  selector: 'wishlist-edit',
  templateUrl: './wishlist-edit.component.html',
  styleUrls: ['./wishlist-edit.component.scss'],
})
export class WishlistEditComponent {
  @Input() isModal: boolean = true;
  wishlistName: string = '';

  onCreateWishlist() {
    console.log('this.wishlistName', this.wishlistName);
  }
}
