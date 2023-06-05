import { User } from './user.model';

export class Review {
  constructor(
    at: string,
    by: {
      _id: string;
      fullname: string;
      imgUrl: string;
      id: string;
    },
    txt: string,
    rate: number
  ) {}
}
