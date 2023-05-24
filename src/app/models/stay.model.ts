import { Review } from './review.model';
import { User } from './user.model';

export class Stay {
  constructor(
    public _id: string,
    public name: string,
    public type: string,
    public imgUrls: string[],
    public price: number,
    public summary: string,
    public capacity: number,
    public amenities: string[],
    public roomType: string,
    public host: User,
    public loc: Location,
    public reviews: Review[],
    public likedByUsers: User[],
    public labels: string[],
    public equipment: Equipment,
    public rate: number
  ) {}
  setId?(id: string = 's101') {
    this._id = id;
  }
  public static fromObject(obj: Partial<Stay>): Stay {
    return new Stay(
      obj._id || '',
      obj.name || '',
      obj.type || '',
      obj.imgUrls || [],
      obj.price || 0,
      obj.summary || '',
      obj.capacity || 0,
      obj.amenities || [],
      obj.roomType || '',
      obj.host!,
      obj.loc!,
      obj.reviews || [],
      obj.likedByUsers || [],
      obj.labels || [],
      obj.equipment || { bedsNum: 0, bathNum: 0, bedroomNum: 0 },
      obj.rate || 0
    );
  }
}

export interface StayFilter {
  labels: string[];
  minPrice: number;
  maxPrice: number;
  equipment: Equipment;
  capacity: number;
  roomType: string;
  amenities: string[];
  superhost: boolean;
}

export interface Equipment {
  bedsNum: number;
  bathNum: number;
  bedroomNum: number;
  [key: string]: number;
}

export const amenities: any = {
  essentials: [
    'Wifi',
    'Kitchen',
    'Private attached bathroom',
    'Washing machine',
    'Dryer',
    'Air conditioning',
    'Heating',
    'Dedicated workspace',
    'TV',
    'Hair dryer',
  ],

  features: [
    'Pool',
    'Hot tub',
    'Free parking on premises',
    'EV charger',
    'Cot',
    'Gym',
    'BBQ grill',
    'Breakfast',
    'Indoor fireplace',
    'Smoking allowed',
  ],

  location: ['Beachfront', 'Waterfront'],
  safety: ['Smoke alarm', 'Carbon monoxide alarm'],
};
