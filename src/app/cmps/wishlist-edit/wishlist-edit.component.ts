import { Component, Input } from '@angular/core';
import { Stay } from 'src/app/models/stay.model';
import { User } from 'src/app/models/user.model';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'wishlist-edit',
  templateUrl: './wishlist-edit.component.html',
  styleUrls: ['./wishlist-edit.component.scss'],
})
export class WishlistEditComponent {
  @Input() isModal: boolean = true;
  @Input() stay!: Stay;
  @Input() user!: User;
  wishlistName: string = '';

  constructor(
    private wishlistService: WishlistService,
    private userSerivce: UserService,
    private sharedSerivce: SharedService
  ) {}

  onCreateWishlist() {
    console.log('this.wishlistName', this.wishlistName);
    console.log('this.stay', this.stay);
    console.log('this.user', this.user);
    const newWishlist = this.wishlistService.createWishlist(
      this.wishlistName,
      this.stay
    );

    this.userSerivce.addWishlistToUser(newWishlist, this.user);

    this.sharedSerivce.openModal();
  }
}
