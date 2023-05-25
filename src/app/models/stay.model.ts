import { Host } from './host.model';
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
    public host: Host,
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

  all: [
    'Internet',
    'Doorman',
    'Elevator',
    'Buzzer/wireless intercom',
    'Family/kid friendly',
    'Smoke detector',
    'Carbon monoxide detector',
    'First aid kit',
    'Safety card',
    'Fire extinguisher',
    'Essentials',
    'Shampoo',
    '24-hour check-in',
    'Hangers',
    'Iron',
    'Laptop friendly workspace',
    'Outlet covers',
    'Bathtub',
    'High chair',
    'Children’s books and toys',
    'Window guards',
    'Crib',
    'Pack ’n Play/travel crib',
    'Room-darkening shades',
    'Hot water',
    'Body soap',
    'Bath towel',
    'Toilet paper',
    'Bed linens',
    'Extra pillows and blankets',
    'Microwave',
    'Coffee maker',
    'Refrigerator',
    'Dishwasher',
    'Dishes and silverware',
    'Cooking basics',
    'Oven',
    'Single level home',
    'Patio or balcony',
    'Long term stays allowed',
    'Step-free access',
    'Step-free access',
    'Wide doorway',
    'Wide clearance to bed',
    'Step-free access',
    'Wide doorway',
    'Wide entryway',
    'Host greets you',
    'Mountain view',
    'Balcony',
    'Sound system',
    'Breakfast table',
    'Espresso machine',
    'Convection oven',
    'Standing valet',
    'Paid parking on premises',
    'Bedroom comforts',
    'Bathroom essentials',
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
