import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Stay } from 'src/app/models/stay.model';
import { User } from 'src/app/models/user.model';
import { Wishlist } from 'src/app/models/wishlist.model';
import { SharedService } from 'src/app/services/shared.service';
import { TrackByService } from 'src/app/services/track-by.service';
import { UserService } from 'src/app/services/user.service.local';
import { WishlistService } from 'src/app/services/wishlist.service';
@Component({
  selector: 'wishlist-list',
  templateUrl: './wishlist-list.component.html',
  styleUrls: ['./wishlist-list.component.scss'],
})
export class WishlistListComponent implements OnInit {
  // @Input() wishlist!: Wishlist;
  @Input() user!: User;
  @Input() isModal: boolean = true;
  @Input() stay!: Stay;
  @Input() isEditMode: boolean = false;
  @Output() removeWishlist = new EventEmitter();
  private destroySubject$ = new Subject<null>();

  constructor(
    private sharedService: SharedService,
    private userService: UserService,
    private wishlistService: WishlistService,
    public trackByService: TrackByService
  ) {}
  ngOnInit(): void {}

  addStayToWishlist(wishlist: Wishlist) {
    const updatedWishlist = this.wishlistService.toggleStayInWishlist(
      wishlist,
      this.stay
    );
    const updatedUser = this.userService.updateWishlistInUser(
      updatedWishlist,
      this.user
    );
    this.user = updatedUser;
    this.sharedService.openModal();
  }

  onRemoveWishlist(wishlistId: string) {
    this.removeWishlist.emit(wishlistId);
  }
}
