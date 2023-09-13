import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IStay, Labels, Stay, amenities } from 'src/app/models/stay.model';
import { User } from 'src/app/models/user.model';
import { StayHost } from 'src/app/models/host.model';
import { StayService } from 'src/app/services/stay.service';
import { UserService } from 'src/app/services/user.service';
import { GeocodingService } from 'src/app/services/geocoding.service';
import { take } from 'rxjs';
import { imgService } from 'src/app/services/img-service.service';
import { UtilService } from 'src/app/services/util.service';

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

  isUserHost: boolean = false;
  selectedCountry: string = '';
  selectedCity: string = '';
  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private geocodingService: GeocodingService,
    private stayService: StayService,
    private imgService: imgService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.userService.loggedInUser$.subscribe((user) => (this.user = user!));
    if (!this.user.id) {
      this.stayHost = StayHost.newHostFromUser(this.user, this.utilService);
    } else {
      this.stayService.findHostById(this.user._id);
      this.isUserHost = true;
    }
    console.log('this.stayHost.id', this.stayHost.id);
    console.log('this.user.id', this.user.id);
  }

  test(str: any) {
    console.log(this.stay);
  }

  handleHostFormSubmit() {
    if (
      this.stayHost.fullname &&
      this.stayHost.description &&
      this.stayHost.location &&
      this.stayHost.thumbnailUrl &&
      this.stayHost.id
    ) {
      this.user.id = this.stayHost.id;
      const newUser = this.userService.updateUser(this.user);
      this.user = newUser;
      this.isUserHost = true;
    }
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
      stay.host.fullname &&
      stay.imgUrls.every((img) => img)
    ) {
      const newStay$ = this.stayService.saveStay(stay);
      let newStay;
      newStay$.pipe(take(1)).subscribe((stay) => (newStay = stay));
    }
  }

  async onImgUpload(ev: any, idx: number = -1) {
    if (ev.target.files && ev.target.files.length) {
      const file = ev.target.files[0];
      try {
        const url = await this.imgService.uploadImageToCloudinary(file);
        idx === -1
          ? (this.stayHost.thumbnailUrl = url)
          : (this.stay.imgUrls[idx] = url);
      } catch (error) {
        console.log(error, 'could not upload file', file);
      }
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
