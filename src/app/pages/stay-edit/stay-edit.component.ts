import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { IStay, Labels, Stay, Amenities } from 'src/app/models/stay.model';
import { User } from 'src/app/models/user.model';
import { StayHost } from 'src/app/models/host.model';
import { StayService } from 'src/app/services/stay.service';
import { UserService } from 'src/app/services/user.service';
import { GeocodingService } from 'src/app/services/geocoding.service';
import { Subject, take, takeUntil, Observable } from 'rxjs';
import { imgService } from 'src/app/services/img-service.service';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackByService } from 'src/app/services/track-by.service';
import { SharedService } from 'src/app/services/shared.service';
import { Unsub } from 'src/app/services/unsub.class';
import { UserMsgService } from 'src/app/services/user-msg.service';

@Component({
  selector: 'stay-edit',
  templateUrl: './stay-edit.component.html',
  styleUrls: ['./stay-edit.component.scss'],
})
export class StayEditComponent extends Unsub implements OnInit {
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
    private sharedService: SharedService,
    private imgService: imgService,
    private utilService: UtilService,
    private router: Router,
    private route: ActivatedRoute,
    public trackByService: TrackByService,
    private userMsgService: UserMsgService
  ) {
    super();
  }

  ngOnInit(): void {
    this.userService.loggedInUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => {
        if (!user) {
          this.router.navigate(['/']);
          return;
        } else if (user && !user.isOwner) {
          this.stayHost = StayHost.newHostFromUser(user);
        } else {
          this.stayService
            .findHostById(user._id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((host) => {
              if (host) {
                this.stay.host = host;
                this.stayHost = host;
              } else {
                this.stayHost = StayHost.newHostFromUser(user);
                this.stay.host = this.stayHost;
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
    this.sharedService.hideElementOnMobile('.main-header');
  }

  ngAfterViewInit() {
    this.sharedService.toggleClassOnElement('google-map-cmp', 'hidden', 'add');
    this.cdr.detectChanges();
  }

  handleHostFormSubmit() {
    this.stayHost.fullname = this.user.fullname;
    this.stayHost.thumbnailUrl = this.user.imgUrl;
    if (
      this.stayHost.fullname &&
      this.stayHost.description &&
      this.stayHost.location &&
      this.stayHost.thumbnailUrl
    ) {
      this.user.isOwner = true;
      const newUser$: Observable<User> = this.userService.updateUser(this.user);
      newUser$.pipe(takeUntil(this.unsubscribe$)).subscribe((user: User) => {
        this.user = user;
        this.stay.host = this.stayHost;
      });
    }
  }

  handleStaySubmit() {
    const stay = { ...this.stay };
    stay.host = this.stayHost;

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
      newStay$.pipe(takeUntil(this.unsubscribe$)).subscribe((stay) => {
        newStay = stay;
        if (newStay) this.stay = newStay;
      });
      this.userService.updateUser(this.user);
      this.router.navigate([`/stay/${this.stay._id}`]);
    } else {
      this.userMsgService.showUserErr(
        "Stay wasn't saved because not all inputs were valid"
      );
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
      stayCoords.pipe(takeUntil(this.unsubscribe$)).subscribe((coords) => {
        const { lat, lng } = coords;
        this.stay.loc.lat = lat;
        this.stay.loc.lng = lng;
      });
    } else if (type === 'host') {
      if (this.stayHost) this.stayHost.location = place.formatted_address;
      else throw new Error('stayHost is falsy');
    }

    this.cdr.detectChanges();
  }

  onToggleCheckboxEntity(ev: Event, str: string, entity: string) {
    this.stay[entity].includes(str)
      ? this.stay[entity].filter((e: string) => e === str)
      : this.stay[entity].push(str);
  }
  override ngOnDestroy() {
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
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((host) => {
          if (!host) this.user.isOwner = false;
          this.userMsgService.showUserErr(
            "Stay wasn't saved because not all inputs were valid"
          );
        });
      return;
    }
    this.user.isOwner = true;
    this.userService.updateUser(this.user);
    this.stayService.saveStay(stay);
    this.sharedService.showElementOnMobile('.main-header');
    super.ngOnDestroy();
  }
}
