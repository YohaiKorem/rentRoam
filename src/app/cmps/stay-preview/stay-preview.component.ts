import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { SearchParam, Stay } from 'src/app/models/stay.model';
import { StayService } from 'src/app/services/stay.service';

@Component({
  selector: 'stay-preview',
  templateUrl: './stay-preview.component.html',
  styleUrls: ['./stay-preview.component.scss'],
})
export class StayPreviewComponent implements OnInit {
  @Input() stay!: Stay;
  constructor(
    private stayService: StayService,
    private cdr: ChangeDetectorRef
  ) {
    // this.getUserLocation();
  }

  isFirstElementInView = true;
  isLastElementInView = false;
  currImgUrlIdx = 0;
  searchParam = {} as SearchParam;
  currDate = { start: new Date(), end: new Date() };
  distance: number = 0;
  userLoc: any = { lat: null, lng: null };
  ngOnInit() {
    this.checkInView();
  }

  setDistance() {
    if (this.searchParam.location) {
      let { lat, lng } = this.searchParam.location?.coords;
      if (lng && lat)
        this.distance = this.stayService.getDistance(
          this.stay,
          this.searchParam.location.coords
        );
      return;
    }
    // this.distance = this.stayService.getDistance(this.stay, this.userLoc);
  }

  // getUserLocation() {
  //   if (navigator.geolocation) {
  //     setInterval(
  //       () =>
  //         navigator.geolocation.getCurrentPosition(
  //           (position) => {
  //             this.userLoc.lat = position.coords.latitude;
  //             this.userLoc.lng = position.coords.longitude;
  //           },
  //           () => {
  //             console.error('Error obtaining geolocation');
  //           }
  //         ),
  //       5000
  //     );
  //   } else {
  //     console.error('Browser does not support geolocation');
  //   }
  // }

  // ngAfterViewInit() {
  //   if (!this.searchParam.startDate && !this.searchParam.endDate) {
  //     this.setDefaultDates();
  //   }
  //   this.cdr.detectChanges();
  // }

  scrollToLeft(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.currImgUrlIdx =
      this.currImgUrlIdx === 0 ? this.currImgUrlIdx : this.currImgUrlIdx - 1;
    this.checkInView();
  }

  setDefaultDates() {
    if (!this.searchParam.startDate && !this.searchParam.endDate) {
      const currentDate = new Date();

      const startDate = new Date(
        currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
      );

      const endDate = new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000);

      this.currDate = {
        start: startDate,
        end: endDate,
      };
      this.searchParam.startDate = startDate;
      this.searchParam.endDate = endDate;
      return;
    }
    this.currDate = {
      start: this.searchParam.startDate!,
      end: this.searchParam.endDate!,
    };
  }

  scrollToRight(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.currImgUrlIdx =
      this.currImgUrlIdx === this.stay.imgUrls.length - 1
        ? this.currImgUrlIdx
        : this.currImgUrlIdx + 1;
    this.checkInView();
  }

  checkInView() {
    this.isFirstElementInView = this.currImgUrlIdx === 0 ? true : false;
    this.isLastElementInView =
      this.currImgUrlIdx === this.stay?.imgUrls.length - 1 ? true : false;
  }
}
