import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IStay, Labels, Stay, Amenities } from 'src/app/models/stay.model';
import { User } from 'src/app/models/user.model';
import { StayHost } from 'src/app/models/host.model';
import { StayService } from 'src/app/services/stay.service';
import { UserService } from 'src/app/services/user.service';
import { GeocodingService } from 'src/app/services/geocoding.service';
import { Subject, take, takeUntil } from 'rxjs';
import { imgService } from 'src/app/services/img-service.service';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'stay-edit',
  templateUrl: './stay-edit.component.html',
  styleUrls: ['./stay-edit.component.scss'],
})
export class StayEditComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  user: User = {} as User;
  stay: IStay = Stay.getEmptyStay();
  allAmenities: string[] = ([] as string[]).concat(...Object.values(Amenities));
  stayHost!: StayHost;
  labels = Labels;

  selectedCountry: string = '';
  selectedCity: string = '';
  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private geocodingService: GeocodingService,
    private stayService: StayService,
    private imgService: imgService,
    private utilService: UtilService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userService.loggedInUser$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        if (!user) {
          this.router.navigate(['/']);
          return;
        } else if (user && !user.isOwner) {
          this.stayHost = StayHost.newHostFromUser(this.user, this.utilService);
          console.log(this.stayHost);
        } else {
          this.stayService
            .findHostById(user._id)
            .pipe(take(1))
            .subscribe((host) => {
              if (host) {
                this.stay.host = host;
                this.stayHost = host;
              } else {
                this.stayHost = StayHost.newHostFromUser(
                  user,
                  this.utilService
                );
                this.stay.host = this.stayHost;
                console.log(this.stay.host);
                console.log(this.stayHost);
              }
            });
        }
        this.user = user!;
      });

    const fetchedStay: IStay | undefined =
      this.route.snapshot.data['fetchedStay'];
    if (fetchedStay) {
      this.stay = fetchedStay;
    }
  }

  test(str: any) {
    console.log(this.stay);
  }

  handleHostFormSubmit() {
    console.log(this.user);
    console.log(this.stayHost);
    this.stayHost.fullname = this.user.fullname;
    this.stayHost.thumbnailUrl = this.user.imgUrl;
    if (
      this.stayHost.fullname &&
      this.stayHost.description &&
      this.stayHost.location &&
      this.stayHost.thumbnailUrl
    ) {
      this.user.isOwner = true;
      const newUser = this.userService.updateUser(this.user);
      this.user = newUser;
      this.stay.host = this.stayHost;
    }
  }

  handleStaySubmit() {
    const stay = { ...this.stay };
    stay.host = this.stayHost;

    console.log(stay);

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
      newStay$.pipe(take(1)).subscribe((stay) => {
        newStay = stay;
        if (newStay) this.stay = newStay;
      });
      this.userService.updateUser(this.user);
      this.router.navigate([`/stay/${this.stay._id}`]);
    } else {
      console.log('not all inputs valid');
    }
  }

  async onImgUpload(ev: any, idx: number = -1) {
    if (ev.target.files && ev.target.files.length) {
      const file = ev.target.files[0];
      try {
        const url = await this.imgService.uploadImageToCloudinary(file);
        idx === -1
          ? ((this.stayHost.thumbnailUrl = url), (this.user.imgUrl = url))
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
    } else if (type === 'host') {
      if (this.stayHost) this.stayHost.location = place.formatted_address;
      else throw new Error('stayHost is falsy');
    }

    console.log(place);
    this.cdr.detectChanges();
  }

  onToggleCheckboxEntity(ev: Event, str: string, entity: string) {
    this.stay[entity].includes(str)
      ? this.stay[entity].filter((e: string) => e === str)
      : this.stay[entity].push(str);
    console.log(this.stay);
  }
  ngOnDestroy() {
    const stay = { ...this.stay };

    if (
      !stay.name ||
      !stay.price ||
      !stay.summary ||
      !stay.roomType ||
      !stay.loc.address ||
      !stay.equipment.bedroomNum ||
      !stay.equipment.bathNum ||
      !stay.equipment.bedsNum ||
      !stay.amenities.length ||
      !stay.host.fullname ||
      !stay.imgUrls.every((img) => img)
    ) {
      this.stayService
        .findHostById(this.user._id)
        .pipe(take(1))
        .subscribe((host) => {
          if (!host) this.user.isOwner = false;
          return;
        });
    }
    this.user.isOwner = true;
    this.userService.updateUser(this.user);
    this.stayService.saveStay(stay);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
