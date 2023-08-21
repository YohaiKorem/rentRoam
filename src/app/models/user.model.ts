import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
export class User {
  constructor(
    public fullname: string,
    public imgUrl: string,
    public password: string,
    public username: string,
    public _id: string
  ) {}

  public static fromFacebook(social: SocialUser): User {
    return new User(
      social.name,
      social.response.picture.data.url,
      social.authToken,
      social.firstName,
      social.id
    );
  }
  public static fromGoogle(social: SocialUser): User {
    return new User(
      social.name,
      social.photoUrl,
      social.idToken,
      social.firstName,
      social.id
    );
  }
}
