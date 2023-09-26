import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Wishlist } from './wishlist.model';
export class User {
  constructor(
    public fullname: string,
    public imgUrl: string,
    public password: string,
    public username: string,
    public _id: string,
    public wishlists: Wishlist[],
    public isOwner: boolean
  ) {}

  public static fromFacebook(social: SocialUser): User {
    return new User(
      social.name,
      social.response.picture.data.url,
      social.authToken,
      social.firstName,
      social.id,
      [],
      false
    );
  }
  public static fromGoogle(social: SocialUser): User {
    return new User(
      social.name,
      social.photoUrl,
      social.idToken,
      social.firstName,
      social.id,
      [],
      false
    );
  }
}
