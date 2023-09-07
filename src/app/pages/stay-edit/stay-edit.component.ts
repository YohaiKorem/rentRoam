import { Component, OnInit } from '@angular/core';
import { IStay, Labels, Stay, amenities } from 'src/app/models/stay.model';
import { User } from 'src/app/models/user.model';
import { StayService } from 'src/app/services/stay.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'stay-edit',
  templateUrl: './stay-edit.component.html',
  styleUrls: ['./stay-edit.component.scss'],
})
export class StayEditComponent implements OnInit {
  user!: User;
  emptyStay: IStay = Stay.getEmptyStay();
  keysForEdit: string[] = this.generateKeys(this.emptyStay);
  amenities = amenities;
  allAmenities: string[] = ([] as string[]).concat(
    ...Object.values(this.amenities)
  );
  labels = Labels;
  constructor(
    private userService: UserService,
    private stayService: StayService
  ) {}

  ngOnInit(): void {
    this.userService.loggedInUser$.subscribe((user) => (this.user = user!));
    this.emptyStay = Stay.getEmptyStay();

    const arr = this.keysForEdit.map(
      (property) => (this.emptyStay as any)[property]
    );
    const items = arr.map((item) => this.determineType(item));
    console.log(this.keysForEdit);
    console.log(arr);
    console.log(items);
    console.log(this.allAmenities);
  }

  test(str: any) {
    console.log(this.emptyStay);
  }

  generateKeys(stay: Stay) {
    return Object.getOwnPropertyNames(stay);
  }

  getLabelForInput(str: any) {
    if (str === 'bathNum') return 'Number of bathrooms';
    if (str === 'bedroomNum') return 'Number of bedrooms';
    if (str === 'bedsNum') return 'Number of beds';
    return null;
  }

  determineType(value: any): string {
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'object' && Array.isArray(value)) return 'array';
    if (typeof value === 'object' && value !== null) return 'object';
    return '';
  }
}
