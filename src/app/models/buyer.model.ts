import { User } from './user.model';

export class Buyer {
  constructor(
    public _id: string,
    public fullname: string,
    public imgUrl: string
  ) {}
  static createBuyerFromUser(user: User) {
    return new Buyer(user._id, user.fullname, user.imgUrl);
  }
}
