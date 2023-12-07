import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  catchError,
  map,
  of,
  tap,
  debounceTime,
  take,
  BehaviorSubject,
} from 'rxjs';
import { environment } from 'src/environments/environment';
declare var google: any;
@Injectable({
  providedIn: 'root',
})
export class AutoCompleteService {
  public autoComplete: any;
  public apiLoaded: boolean = false;
  private apiLoadedSubject = new BehaviorSubject<boolean>(false);
  public apiLoaded$ = this.apiLoadedSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    this.loadGoogleMapsAPI();
  }

  private loadGoogleMapsAPI(): void {
    if (this.apiLoaded) {
      return;
    }

    this.httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsAPI}&libraries=places`,
        'callback'
      )
      .pipe(
        map(() => true),
        tap(() => {
          this.autoComplete = new google.maps.places.AutocompleteService();
          this.apiLoaded = true;
          this.apiLoadedSubject.next(true);
        }),
        catchError((err) => {
          console.error('Failed to load Google Maps API', err);
          this.apiLoadedSubject.next(false);
          return of(false);
        })
      )
      .subscribe();
  }
}
