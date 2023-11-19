import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Stay } from 'src/app/models/stay.model';
import { User } from 'src/app/models/user.model';
import { Wishlist } from 'src/app/models/wishlist.model';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service.local';
import { WishlistService } from 'src/app/services/wishlist.service';
import { Router } from '@angular/router';

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
  isRemovingWishlist: boolean = false;
  constructor(
    private wishlistService: WishlistService,
    private userSerivce: UserService,
    private sharedSerivce: SharedService,
    private router: Router
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

  toggleRemoveWishlist() {
    this.isRemovingWishlist = true;
  }

  onRemoveWishlist() {
    if (!this.wishlist?.id) return;
    this.user = this.userSerivce.removeWishlist(this.wishlist!.id, this.user);
    this.wishlist = null;
    this.onEditFinished();
    this.router.navigate([`/wishlist/${this.user._id}`]);
  }

  onEditFinished() {
    let res = { user: this.user, wishlist: this.wishlist };
    this.editFinished.emit(res);
  }
}
