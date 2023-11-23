import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { SearchParam, Stay } from 'src/app/models/stay.model';
import { Subject, takeUntil } from 'rxjs';
import { StayService } from 'src/app/services/stay.service';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { TrackByService } from 'src/app/services/track-by.service';
import { Unsub } from 'src/app/services/unsub.class';
@Component({
  selector: 'google-map-cmp',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapCmpComponent extends Unsub implements OnInit {
  @Input() stays!: Stay[] | null;
  @Input() zoom: number = 15;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  constructor(
    private stayService: StayService,
    public trackByService: TrackByService
  ) {
    super();
  }
  searchParam = {} as SearchParam;
  center!: google.maps.LatLngLiteral;

  display!: google.maps.LatLngLiteral;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
  };
  staysCoords: any = null;
  markers: any = [];
  selectedStay: Stay | null = null;

  ngOnInit(): void {
    this.stayService.searchParams$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((searchParam) => {
        let coords = { lat: 24, lng: 12 };
        let { lat, lng } = searchParam.location.coords;
        if (lat && lng) coords = { lat, lng };

        this.searchParam = searchParam;
        this.center = coords;
      });
    this.updateStaysCoords();
  }

  ngOnChanges(changes: any): void {
    if (changes['stays'] && !changes.stays.firstChange) {
      this.updateStaysCoords();
    }
  }

  openInfoWindow(marker: MapMarker, stay: Stay) {
    this.selectedStay = stay;
    if (this.infoWindow) this.infoWindow.open(marker);
  }

  private updateStaysCoords() {
    if (this.stays) {
      this.markers = this.stays.map((stay) => this.makeIntoCustomMarker(stay));
    }
  }

  makeIntoCustomMarker(stay: Stay) {
    const pillIcon: google.maps.Icon = {
      url: `data:image/svg+xml;utf8,
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 60" role="presentation" focusable="false" style="display: block; height: 62px; width: 62px;">
        <defs>
          <filter id="f1" x="0" y="0" width="150%" height="150%">
            <feOffset result="offOut" in="SourceAlpha" dx="3" dy="3" />
            <feGaussianBlur result="blurOut" in="offOut" stdDeviation="3" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>
        </defs>
        <rect x="0" y="0" rx="30" ry="30" width="250" height="60" fill="%23FFFFFF" filter="url(%23f1)"/>
        <text x="125" y="45" font-family="Circular, -apple-system, BlinkMacSystemFont, roboto, Helvetica neue, sans-serif" font-size="46" text-anchor="middle" fill="%23000000">$${stay.price}</text>
      </svg>`,
      scaledSize: new google.maps.Size(62, 62),
    };
    return {
      position: { lat: stay.loc.lat, lng: stay.loc.lng },
      stay,
      pillIcon,
    };
  }

  moveMap(event: google.maps.MapMouseEvent) {
    this.center = event.latLng!.toJSON();
  }

  move(event: google.maps.MapMouseEvent) {
    this.display = event.latLng!.toJSON();
  }
}
