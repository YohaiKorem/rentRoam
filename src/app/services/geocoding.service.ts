import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  constructor(private http: HttpClient) {}

  public getLatLng(place: string): Observable<any> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=AIzaSyD6VYrEZ0nY107CEP22L0mZ0gmu-7eLf1Y`;
    return this.http.get(url).pipe(
      map((response: any) => {
        if (response.status === 'OK') {
          const location = response.results[0].geometry.location;
          return { lat: location.lat, lng: location.lng };
        } else {
          throw 'Unable to find location: ' + response.status;
        }
      })
    );
  }
}
