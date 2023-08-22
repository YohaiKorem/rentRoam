import { Stay } from './stay.model';

export class Wishlist {
  constructor(public id: string, public name: string, public stays: Stay[]) {}
}
