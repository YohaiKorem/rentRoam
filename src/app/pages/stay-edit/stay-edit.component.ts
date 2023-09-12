import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IStay, Labels, Stay, amenities } from 'src/app/models/stay.model';
import { User } from 'src/app/models/user.model';
import { StayHost } from 'src/app/models/host.model';
import { StayService } from 'src/app/services/stay.service';
import { UserService } from 'src/app/services/user.service';
import { GeocodingService } from 'src/app/services/geocoding.service';
import { take } from 'rxjs';

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
  selectedCountry: string = '';
  selectedCity: string = '';
  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private geocodingService: GeocodingService,
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
    const stay = { ...this.stay };

    if (
      stay.name &&
      stay.price &&
      stay.summary &&
      stay.roomType &&
      stay.loc.address &&
      stay.equipment.bedroomNum &&
      stay.equipment.bathNum &&
      stay.equipment.bedsNum &&
      stay.amenities.length &&
      stay.imgUrls.every((img) => img)
    ) {
      this.stayService.saveStay(stay);
    }
    let res = this.stayService.saveStay(stay);
    console.log(res);
  }

  onImgUpload(ev: any, idx: number = -1) {
    if (ev.target.files && ev.target.files.length) {
      const file = ev.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        console.log(idx);

        idx === -1
          ? (this.stayHost.thumbnailUrl = reader.result as string)
          : (this.stay.imgUrls[idx] = reader.result as string);
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
    }
    console.log(this.stay.imgUrls);
  }

  updateStayLoc(place: any) {
    console.log(place);
  }

  detectChanges() {
    this.cdr.detectChanges();
  }

  handlePlaceSelection(place: any, type: string) {
    if (!place || !place.address_components) {
      return;
    }

    if (type === 'stay-country') {
      this.selectedCountry = place.address_components[0].short_name;
      this.stay.loc.countryCode = this.selectedCountry;
      this.stay.loc.country = place.name;
      console.log(this.selectedCountry);
    } else if (type === 'stay-city') {
      this.selectedCity = place.address_components[0].long_name;
      this.stay.loc.city = place.address_components[0].long_name;
    } else if (type === 'stay-address') {
      this.stay.loc.address = place.name;
      let strForCoords = '';
      strForCoords = strForCoords.concat(
        this.stay.loc.address,
        ', ',
        this.stay.loc.city,
        ', ',
        this.stay.loc.country
      );
      const stayCoords = this.geocodingService.getLatLng(strForCoords);
      stayCoords.pipe(take(1)).subscribe((coords) => {
        const { lat, lng } = coords;
        this.stay.loc.lat = lat;
        this.stay.loc.lng = lng;
      });
    } else this.stayHost.location = place.formatted_address;

    console.log(place);
    this.cdr.detectChanges();
  }

  onToggleCheckboxEntity(ev: Event, str: string, entity: string) {
    this.stay[entity].includes(str)
      ? this.stay[entity].filter((e: string) => e === str)
      : this.stay[entity].push(str);
    console.log(this.stay);
  }
}
