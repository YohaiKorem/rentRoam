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
@Component({
  selector: 'google-map-cmp',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapCmpComponent implements OnInit {
  @Input() stays!: Stay[] | null;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  constructor(private stayService: StayService) {}
  searchParam = {} as SearchParam;
  private destroySubject$ = new Subject<null>();
  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 15;

  display!: google.maps.LatLngLiteral;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
  };
  staysCoords: any = null;
  markers: any = [];
  selectedStay: Stay | null = null;
  ngOnInit(): void {
    this.stayService.searchParams$
      .pipe(takeUntil(this.destroySubject$))
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
    this.infoWindow.open(marker);
  }

  private updateStaysCoords() {
    if (this.stays) {
      this.markers = this.stays.map((stay) => this.makeIntoCustomMarker(stay));
    }
  }

  makeIntoCustomMarker(stay: Stay) {
    // const { Map } = (await google.maps.importLibrary(
    //   'maps'
    // )) as google.maps.MapsLibrary;
    // const { AdvancedMarkerElement } = (await google.maps.importLibrary(
    //   'marker'
    // )) as google.maps.MarkerLibrary;

    // const priceTag = document.createElement('div');
    // priceTag.className = 'price-tag';
    // priceTag.textContent = '$2.5M';

    return {
      position: { lat: stay.loc.lat, lng: stay.loc.lng },
      stay,
    };
  }

  moveMap(event: google.maps.MapMouseEvent) {
    this.center = event.latLng!.toJSON();
  }

  move(event: google.maps.MapMouseEvent) {
    this.display = event.latLng!.toJSON();
  }
}
