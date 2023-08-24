import { StayPreview } from './stay-preview.model';
import { Stay } from './stay.model';

export class Wishlist {
  constructor(
    public name: string,
    public stays: StayPreview[] = [],
    public id: string | undefined
  ) {
    if (!id) {
      this.id = this._getRandomId();
    }
  }
  private _getRandomId(length = 8): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }
}
