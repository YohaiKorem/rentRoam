import { Injectable } from '@angular/core';
import { Stay } from '../models/stay.model';
import { User } from '../models/user.model';
import { StayPreview } from '../models/stay-preview.model';
import { Wishlist } from '../models/wishlist.model';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor() {}

  public createWishlist(name: string, stay: Stay): Wishlist {
    const stayPreview = new StayPreview(stay);
    const newWishlist = new Wishlist(name, [stayPreview], undefined);
    return newWishlist;
  }
  public toggleStayInWishlist(wishlist: Wishlist, stay: Stay) {
    const stayPreview = new StayPreview(stay);
    const updatedWishlist = { ...wishlist };
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
}
