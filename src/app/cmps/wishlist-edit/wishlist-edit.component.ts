import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Stay } from 'src/app/models/stay.model';
import { User } from 'src/app/models/user.model';
import { Wishlist } from 'src/app/models/wishlist.model';
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
  @Input() isWishlistDetails: boolean = false;
  @Input() wishlist: Wishlist | null = null;
  @Input() wishlistName: string = '';
  @Output() editFinished = new EventEmitter();

  constructor(
    private wishlistService: WishlistService,
    private userSerivce: UserService,
    private sharedSerivce: SharedService
  ) {}

  onCreateWishlist() {
    const newWishlist = this.wishlistService.createWishlist(
      this.wishlistName,
      this.stay
    );

    this.userSerivce.addWishlistToUser(newWishlist, this.user);

    this.sharedSerivce.openModal();
  }
  onEditWishlist() {
    if (!this.wishlist || !this.user) return;
    let wishlist: Wishlist = JSON.parse(JSON.stringify(this.wishlist));
    wishlist.name = this.wishlistName;
    const updatedWishlist = this.wishlistService.editWishlist(wishlist);
    this.wishlist = updatedWishlist;
    this.user = this.userSerivce.updateWishlistInUser(
      updatedWishlist,
      this.user
    );

    this.onEditFinished();
  }

  onRemoveWishlist() {}

  onEditFinished() {
    let res = { user: this.user, wishlist: this.wishlist };
    this.editFinished.emit(res);
  }
}
