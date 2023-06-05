import { User } from './user.model';

export class Review {
  constructor(
    public at: string,
    public by: {
      _id: string;
      fullname: string;
      imgUrl: string;
      id: string;
    },
    public txt: string,
    public rate: number
  ) {}
}
