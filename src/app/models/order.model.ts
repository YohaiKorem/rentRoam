import { Buyer } from './buyer.model';
import { SearchParam, Stay } from './stay.model';
import { User } from './user.model';

export class Order {
  constructor(
    public _id: string,
    public hostId: string,
    public buyer: Buyer,
    public totalPrice: number,
    public checkin: number,
    public checkout: number,
    public guests: {
      adults: number;
      children: number;
      infants: number;
    },
    public stay: {
      _id: string;
      name: string;
      price: number;
    },
    public msgs: [],
    public status: string
  ) {}
  static createOrderFromInput(
    user: User,
    stay: Stay,
    searchParam: SearchParam
  ) {
    const stayForOrder = { _id: stay._id, name: stay.name, price: stay.price };
    const buyer: Buyer = Buyer.createBuyerFromUser(user);

    const timeDifference =
      searchParam.endDate!.getTime() - searchParam.startDate!.getTime();
    const totalPrice =
      Math.ceil(timeDifference / (1000 * 3600 * 24)) * stay.price;

    return new Order(
      '',
      stay.host._id,
      buyer,
      totalPrice,
      Date.parse(searchParam.startDate!.toDateString()),
      Date.parse(searchParam.endDate!.toDateString()),
      searchParam.guests,
      stayForOrder,
      [],
      'pending'
    );
  }
}
