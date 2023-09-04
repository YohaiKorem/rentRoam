import { Injectable } from '@angular/core';
import { Stay } from '../models/stay.model';
import { User } from '../models/user.model';
import { StayPreview } from '../models/stay-preview.model';
import { Wishlist } from '../models/wishlist.model';
import { StayService } from './stay.service';
import { Observable, forkJoin } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor(private stayService: StayService) {}

  public createWishlist(name: string, stay: Stay): Wishlist {
    const stayPreview = new StayPreview(stay);
    const newWishlist = new Wishlist(name, [stayPreview], undefined);
    return newWishlist;
  }
  public toggleStayInWishlist(wishlist: Wishlist, stay: Stay): Wishlist {
    const stayPreview = new StayPreview(stay);
    const updatedWishlist = new Wishlist(
      wishlist.name,
      wishlist.stays,
      wishlist.id
    );
    let hasStay = updatedWishlist.stays.some((stay) => {
      return stay._id === stayPreview._id;
    });
    if (hasStay) {
      const idx = updatedWishlist.stays.findIndex((s) => {
        return stay._id === s._id;
      });
      updatedWishlist.stays.splice(idx, 1);
    } else {
      updatedWishlist.stays.push(stayPreview);
    }
    return updatedWishlist;
  }
  public findWishlist(user: User, wishlistId: string) {
    return user.wishlists.find(
      (wishlist: Wishlist) => wishlist.id === wishlistId
    );
  }

  public getStaysArrFromWishlist(wishlist: Wishlist): Observable<Stay[]> {
    return forkJoin(
      wishlist.stays.map((stay) => this.stayService.getStayById(stay._id))
    );
  }
}
