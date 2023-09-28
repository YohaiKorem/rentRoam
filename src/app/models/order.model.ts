import { Buyer } from './buyer.model';

export class Order {
  constructor(
    public _id: string,
    public hostId: string,
    public buyer: Buyer,
    public totalPrice: number,
    public checkin: string,
    public checkout: string,
    public guests: {
      adults: number;
      kids: number;
    },
    public stay: {
      _id: string;
      name: string;
      price: number;
    },
    public msgs: [],
    public status: string
  ) {}
}
