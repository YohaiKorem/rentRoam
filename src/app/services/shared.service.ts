import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, of } from 'rxjs';
import { Stay } from '../models/stay.model';
import { environment } from 'src/environments/env.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(private httpClient: HttpClient) {}
  apiLoaded!: Observable<boolean>;

  private toggleSignupModalSource = new Subject<void>();
  toggleSignupModal$ = this.toggleSignupModalSource.asObservable();
  private openModalSource = new Subject<{ str: string; data: Stay | null }>();
  openModal$ = this.openModalSource.asObservable();

  private openSearchMenuSource = new Subject<void>();
  openSearchMenu$ = this.openSearchMenuSource.asObservable();
  private openSearchMenuMobileSource = new Subject<void>();
  openSearchMenuMobile$ = this.openSearchMenuMobileSource.asObservable();

  openModal(str = '', data: Stay | null = null) {
    this.openModalSource.next({ str, data });
  }

  openSearchMenu() {
    this.openSearchMenuSource.next();
  }

  openSearchMenuMobile() {
    this.openSearchMenuMobileSource.next();
  }

  toggleSignUpModal() {
    this.toggleSignupModalSource.next();
  }

  showElementOnMobile(selector: string) {
    const el = document.querySelector(selector);
    el?.classList.remove('hidden-on-mobile');
  }

  hideElementOnMobile(selector: string) {
    const el = document.querySelector(selector);
    el?.classList.add('hidden-on-mobile');
  }
  // loadGoogleMaps(): Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     // Check if script is already loaded
  //     if (window.google && window.google.maps) {
  //       resolve();
  //       return;
  //     }

  //     const script = document.createElement('script');
  //     script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsAPI}&libraries=places,marker&callback=initMap`;
  //     script.async = true;
  //     script.defer = true;
  //     script.onload = (event: Event) => resolve();
  //     script.onerror = (message, source, lineno, colno, error) => reject(error);

  //     document.body.appendChild(script);
  //     document.body.removeChild(script);
  //   });
  // }

  // loadGoogleMaps() {
  //   this.apiLoaded = this.httpClient
  //     .jsonp(
  //       `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsAPI}`,
  //       'callback'
  //     )
  //     .pipe(
  //       map(() => true),
  //       catchError(() => of(false))
  //     );
  // }
}
