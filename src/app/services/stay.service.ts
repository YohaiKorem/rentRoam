import { Injectable } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  throwError,
  from,
  tap,
  retry,
  catchError,
  take,
  switchMap,
  of,
} from 'rxjs';
import { storageService } from './async-storage.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { SearchParam, Stay, StayFilter } from '../models/stay.model';
import _stays from '../../data/stay.json';
import { GeocodingService } from './geocoding.service';
import { getDistance } from 'geolib';
const ENTITY = 'stays';

@Injectable({
  providedIn: 'root',
})
export class StayService {
  private _stays$ = new BehaviorSubject<Stay[]>([]);
  public stays$ = this._stays$.asObservable();
  public googleMapsAPI = 'AIzaSyAaeVqcfMAlJj1ZQfNXP9pkOBtojwlJwnQ';
  public geocodeAPI = 'AIzaSyD6VYrEZ0nY107CEP22L0mZ0gmu-7eLf1Y';
  private _stayFilter$ = new BehaviorSubject<StayFilter>({
    labels: [],
    minPrice: 0,
    maxPrice: 0,
    equipment: { bedsNum: 0, bathNum: 0, bedroomNum: 0 },
    capacity: 0,
    roomType: '',
    amenities: [],
    superhost: false,
  });
  public stayFilter$ = this._stayFilter$.asObservable();
  private _filterCount$ = new BehaviorSubject<number>(0);
  public filterCount$ = this._filterCount$.asObservable();
  private _searchParams$ = new BehaviorSubject<SearchParam>({
    startDate: null,
    endDate: null,
    location: { name: null, coords: { lat: 24, lng: 26 } },
    guests: { adults: 0, children: 0, infants: 0 },
  });
  public searchParams$ = this._searchParams$.asObservable();
  private _avgPrice$ = new BehaviorSubject<number>(0);
  public avgPrice$ = this._avgPrice$.asObservable();
  private _lowestPrice$ = new BehaviorSubject<number>(1);
  public lowestPrice$ = this._lowestPrice$.asObservable();
  private _highestPrice$ = new BehaviorSubject<number>(0);
  public highestPrice$ = this._highestPrice$.asObservable();
  constructor(
    private http: HttpClient,
    private geocodingService: GeocodingService
  ) {
    let stays = JSON.parse(localStorage.getItem(ENTITY) || 'null');

    if (!stays || stays.length === 0) {
      stays = this._createStays();
      localStorage.setItem(ENTITY, JSON.stringify(stays));
      // .subscribe(
      //   (fetchedStays) => {
      //     localStorage.setItem(ENTITY, JSON.stringify(fetchedStays));
      //     this._stays$.next(fetchedStays);
      //   },
      //   (error) => {
      //     console.error('Error fetching stays:', error);
      // }
      // );
    } else {
      this._stays$.next(stays);
    }
    this.setAvgPrice(stays);
  }

  public initMap() {
    console.log('map init');
  }

  public loadStays(): Observable<Stay[]> {
    return from(storageService.query(ENTITY)).pipe(
      switchMap((stays: Stay[]) => {
        const filterBy = this._stayFilter$.value;
        const searchParams = this._searchParams$.value;

        let filteredStays = this._filter(stays, filterBy);

        return this.search(filteredStays, searchParams).pipe(
          tap((searchedStays: Stay[]) => {
            this.setAvgPrice(searchedStays);
            this.setHigheststPrice(searchedStays);
            this.setLowestPrice(searchedStays);

            const sortedStays = this._sort(searchedStays);
            this._stays$.next(sortedStays);
          })
        );
      }),
      retry(1),
      catchError(this._handleError)
    );
  }

  public getStayById(id: string): Observable<Stay> {
    let res = from(storageService.get(ENTITY, id)).pipe(
      catchError(this._handleError)
    );

    return res;
  }

  public removeStay(id: string) {
    return from(storageService.remove(ENTITY, id)).pipe(
      tap(() => {
        let stays = this._stays$.value;
        stays = stays.filter((stay) => stay._id !== id);
        this._stays$.next(stays);
      }),
      retry(1),
      catchError(this._handleError)
    );
  }

  public saveStay(stay: Stay) {
    return stay._id ? this._updateStay(stay) : this._addStay(stay);
  }

  public getEmptyStay() {
    return {
      name: '',
      type: '',
      imgUrls: [],
      price: 0,
      summary: '',
      capacity: 0,
      amenities: [],
      roomType: '',
      host: {},
      loc: {},
      reviews: [],
      likedByUsers: [],
      labels: [],
      equipment: { bedsNum: 0, bathNum: 0, bedroomNum: 0 },
      rate: 0,
    };
  }
  public setLowestPrice(stays: Stay[]) {
    this._lowestPrice$.next(
      stays.reduce(
        (acc, stay) => (stay.price < acc ? stay.price : acc),
        Infinity
      )
    );
  }
  public setHigheststPrice(stays: Stay[]) {
    this._highestPrice$.next(
      stays.reduce(
        (acc, stay) => (stay.price > acc ? stay.price : acc),
        -Infinity
      )
    );
  }
  public setAvgPrice(stays: Stay[]) {
    let sumPrices = stays
      .map((stay) => stay.price)
      .reduce((acc, price) => acc + price, 0);
    let avg = Math.floor(sumPrices / (stays.length - 1));
    this._avgPrice$.next(avg);
  }

  public setSearchParams(searchParam: SearchParam) {
    if (searchParam.location.name) {
      this.geocodingService
        .getLatLng(searchParam.location.name)
        .pipe(
          take(1),
          tap((coords: any) => {
            if (coords) {
              searchParam.location.coords = {
                lat: coords.lat,
                lng: coords.lng,
              };
            }
            this._searchParams$.next({ ...searchParam });
            this.loadStays().pipe(take(1)).subscribe();
          }),
          catchError(this._handleError)
        )
        .subscribe();
    } else {
      this._searchParams$.next({ ...searchParam });
      this.loadStays().pipe(take(1)).subscribe();
    }
  }

  public setFilter(stayFilter: StayFilter) {
    this._stayFilter$.next({ ...stayFilter });
    this.loadStays().pipe(take(1)).subscribe();
  }

  public setFilterCount(filterCount: number) {
    this._filterCount$.next(filterCount);
  }

  public clearFilter() {
    this.setFilter({
      labels: [],
      minPrice: 0,
      maxPrice: 0,
      equipment: { bedsNum: 0, bathNum: 0, bedroomNum: 0 },
      capacity: 0,
      roomType: '',
      amenities: [],
      superhost: false,
    });
  }

  private search(stays: Stay[], searchParams: SearchParam): Observable<Stay[]> {
    let searchedStays = stays;

    if (searchParams.guests.adults) {
      searchedStays = stays.filter(
        (stay) =>
          stay.capacity >=
          searchParams.guests.adults + searchParams.guests.children
      );
    }

    if (
      searchParams.location.coords?.lat &&
      searchParams.location.coords?.lng
    ) {
      if (
        searchParams.location.name &&
        searchParams.location.name !== "I'm flexible"
      ) {
        return this.geocodingService.getLatLng(searchParams.location.name).pipe(
          switchMap((coords: any) => {
            if (coords) {
              const distanceLimitInMeters = 5000;
              searchedStays = searchedStays.filter((stay) => {
                if (
                  stay.loc &&
                  stay.loc.lat &&
                  stay.loc.lng &&
                  coords &&
                  coords.lat &&
                  coords.lng
                ) {
                  const distance = this.getDistance(stay, coords);
                  return distance <= distanceLimitInMeters;
                }
                return false;
              });
              searchParams.location.coords = coords;
            }

            return of(searchedStays);
          })
        );
      }
    }

    return of(searchedStays);
  }

  public getDistance(stay: Stay, coords: any) {
    return getDistance(
      { latitude: stay.loc.lat, longitude: stay.loc.lng },
      { latitude: coords.lat, longitude: coords.lng }
    );
  }

  private _updateStay(stay: Stay) {
    return from(storageService.put(ENTITY, stay)).pipe(
      tap((updatedStay) => {
        const stays = this._stays$.value;
        const stayIdx = stays.findIndex((_stay) => _stay._id === stay._id);
        stays.splice(stayIdx, 1, updatedStay);
        this._stays$.next([...stays]);
        return updatedStay;
      }),
      retry(1),
      catchError(this._handleError)
    );
  }

  private _addStay(stay: Stay) {
    const newStay = Stay.fromObject(stay);
    if (typeof newStay.setId === 'function') newStay.setId(this._getRandomId());
    return from(storageService.post(ENTITY, newStay)).pipe(
      tap((newStay) => {
        const stays = this._stays$.value;
        this._stays$.next([...stays, newStay]);
      }),
      retry(1),
      catchError(this._handleError)
    );
  }

  private _sort(stays: Stay[]) {
    return stays.sort((a, b) => {
      if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
        return -1;
      }
      if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
        return 1;
      }
      return 0;
    });
  }

  private _filter(stays: Stay[], filterBy: any): Stay[] {
    let filteredStays = stays;
    if (filterBy.labels && filterBy.labels.length > 0)
      filteredStays = filteredStays.filter(
        (stay) =>
          stay.labels.includes(filterBy.labels[0]) ||
          stay.type === filterBy.labels[0]
      );

    if (
      filterBy.equipment &&
      (filterBy.equipment.bathNum || filterBy.equipment.bedsNum)
    ) {
      if (filterBy.equipment.bathNum) {
        filteredStays = filteredStays.filter(
          (stay) => stay.equipment.bathNum >= filterBy.equipment.bathNum
        );
      }

      if (filterBy.equipment.bedsNum) {
        filteredStays = filteredStays.filter(
          (stay) => stay.equipment.bedsNum >= filterBy.equipment.bedsNum
        );
      }
    }
    if (filterBy.amenities && filterBy.amenities.length)
      filteredStays = filteredStays.filter((stay) => {
        return filterBy.amenities.every((amenity: string) =>
          stay.amenities.includes(amenity)
        );
      });

    if (filterBy.superhost)
      filteredStays = filteredStays.filter(
        (stay) => stay.host.isSuperhost === true
      );

    if (filterBy.maxPrice)
      filteredStays = filteredStays.filter(
        (stay) => stay.price <= filterBy.maxPrice
      );
    if (filterBy.minPrice)
      filteredStays = filteredStays.filter(
        (stay) => stay.price >= filterBy.minPrice
      );
    this._countFilters(filterBy);
    return filteredStays;
  }

  private _countFilters(filterBy: any) {
    let count = 0;
    if (filterBy.labels && filterBy.labels.length > 0) count++;
    if (
      filterBy.equipment &&
      (filterBy.equipment.bathNum || filterBy.equipment.bedsNum)
    )
      count++;
    if (filterBy.amenities && filterBy.amenities.length) count++;

    if (filterBy.superhost) count++;

    if (filterBy.maxPrice || filterBy.minPrice) count++;
    this.setFilterCount(count);
  }

  private _createStays() {
    return _stays;
  }

  private _handleError(err: HttpErrorResponse) {
    console.log('error in pet service:', err);
    return throwError(() => err);
  }

  private _getRandomId(length = 8): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }
}
