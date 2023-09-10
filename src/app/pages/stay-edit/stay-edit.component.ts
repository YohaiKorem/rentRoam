import { Component, OnInit } from '@angular/core';
import { IStay, Labels, Stay, amenities } from 'src/app/models/stay.model';
import { User } from 'src/app/models/user.model';
import { StayHost } from 'src/app/models/host.model';
import { StayService } from 'src/app/services/stay.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'stay-edit',
  templateUrl: './stay-edit.component.html',
  styleUrls: ['./stay-edit.component.scss'],
})
export class StayEditComponent implements OnInit {
  user!: User;
  stay: IStay = Stay.getEmptyStay();
  amenities = amenities;
  allAmenities: string[] = ([] as string[]).concat(
    ...Object.values(this.amenities)
  );
  stayHost!: StayHost;
  labels = Labels;
  hasHost: boolean = true;
  selectedCountry: any;
  selectedCity: any;
  constructor(
    private userService: UserService,
    private stayService: StayService
  ) {}

  ngOnInit(): void {
    this.userService.loggedInUser$.subscribe((user) => (this.user = user!));
    // if (!this.stay.host.fullname) {
    //   this.stayHost = StayHost.newHostFromUser(this.user);
    //   this.hasHost = false;
    // } else {
    //   this.hasHost = true;
    // }
    this.stayHost = StayHost.newHostFromUser(this.user);
  }

  test(str: any) {
    console.log(this.stay);
  }

  handleHostFormSubmit() {
    if (
      this.stayHost.fullname &&
      this.stayHost.description &&
      this.stayHost.location &&
      this.stayHost.thumbnailUrl
    )
      this.hasHost = true;
    console.log(this.hasHost);
  }

  handleStaySubmit() {
    console.log(this.stay);
  }

  onImgUpload(ev: any, idx: number = -1) {
    if (ev.target.files && ev.target.files.length) {
      const file = ev.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        idx === -1
          ? (this.stayHost.thumbnailUrl = reader.result as string)
          : (this.stay.imgUrls[idx] = reader.result as string);
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
    }
  }

  updateStayLoc(place: any) {
    console.log(place);
  }

  handlePlaceSelection(place: any, type: string) {
    if (!place || !place.address_components) {
      return;
    }
    if (type === 'stay-country') {
      this.selectedCountry = place.address_components[0].short_name;
    } else if (type === 'stay-city') {
      this.selectedCity = place.address_components[0].long_name;
    }
    console.log(this.selectedCountry);
    console.log(this.selectedCity);
  }

  onToggleCheckboxEntity(ev: Event, str: string, entity: string) {
    this.stay[entity].includes(str)
      ? this.stay[entity].filter((e: string) => e === str)
      : this.stay[entity].push(str);
    console.log(this.stay);
  }
}
