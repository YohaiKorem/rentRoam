import { StayHost } from './host.model';
import { Review } from './review.model';
import { User } from './user.model';

export class Stay implements IStay {
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
    public host: StayHost,
    public loc: Loc,
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
  public static getEmptyStay(): Stay {
    return new Stay(
      '',
      '',
      '',
      ['', '', '', '', ''],
      0,
      '',
      0,
      [],
      '',
      {} as StayHost,
      { country: '', countryCode: '', city: '', address: '', lat: 0, lng: 0 },
      [],
      [],
      [],
      { bedsNum: null, bathNum: null, bedroomNum: null },
      0
    );
  }
}

export interface IStay {
  [key: string]: any;

  _id: string;
  name: string;
  type: string;
  imgUrls: string[];
  price: number;
  summary: string;
  capacity: number;
  amenities: string[];
  roomType: string;
  host: StayHost;
  loc: Loc;
  reviews: Review[];
  likedByUsers: User[];
  labels: string[];
  equipment: Equipment;
  rate: number;
}

export interface SearchParam {
  startDate: Date | null;
  endDate: Date | null;
  location: {
    name: string | null;
    coords: google.maps.LatLngLiteral;
  };
  guests: {
    adults: number;
    children: number;
    infants: number;
    [key: string]: number;
  };
}

export interface Loc {
  country: string;
  countryCode: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
}
export interface StayDistance {
  _id: string;
  distance: number;
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

export interface Pagination {
  pageIdx: number;
  pageSize: number;
}

export interface Equipment {
  bedsNum: number | null;
  bathNum: number | null;
  bedroomNum: number | null;
  [key: string]: number | null;
}

export const Labels: string[] = [
  'Rooms',
  'Amazing pools',
  'Amazing views',
  'OMG!',
  'Design',
  'Castles',
  'Lakefront',
  'Cabins',
  'Islands',
  'Beachfront',
  'Luxe',
  'Trending',
  'Countryside',
  'National parks',
  'Off-the-grid',
  'Play',
  'Earth homes',
  'Tropical',
  'Caves',
  'Boats',
  'Iconic',
  'Skiing',
  'Ski-in/out',
  'Ryokans',
  'casas particulares',
  'Hanoks',
  'Campers',
  'Golfing',
  'Minsus',
  'Adapted',
  'Beach',
];

export const Amenities: { [key: string]: string[] } = {
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
