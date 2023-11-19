import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Wishlist } from './wishlist.model';
export class User {
  constructor(
    public _id: string,
    public fullname: string,
    public imgUrl: string,
    public username: string,
    public wishlists: Wishlist[],
    public isOwner: boolean,
    public password?: string
  ) {}

  public static fromFacebook(social: SocialUser): User {
    console.log(social);

    return new User(
      social.id,
      social.name,
      social.response.picture.data.url,
      social.firstName,
      [],
      false,
      social.authToken
    );
  }
  public static fromGoogle(social: SocialUser): User {
    return new User(
      social.id,
      social.name,
      social.photoUrl,
      social.firstName,
      [],
      false,
      social.idToken
    );
  }
}
