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
  map,
  combineLatest,
} from 'rxjs';
import { storageService } from './async-storage.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import {
  SearchParam,
  Stay,
  StayDistance,
  StayFilter,
} from '../models/stay.model';
import _stays from '../../data/stay.json';
import { GeocodingService } from './geocoding.service';
import { getDistance } from 'geolib';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service.local';
import { UtilService } from './util.service';
import { StayHost } from '../models/host.model';
import { Router, ActivatedRoute } from '@angular/router';

const ENTITY = 'stays';

@Injectable({
  providedIn: 'root',
})
export class StayService {
  private _stays$ = new BehaviorSubject<Stay[]>([]);
  public stays$ = this._stays$.asObservable();
  private _distances$ = new BehaviorSubject<StayDistance[]>([]);
  public distances$ = this._distances$.asObservable();
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
    // for debuggin location
    // location: {
    //   name: 'Porto, Portugal',
    //   coords: { lat: 41.1462, lng: -8.59275 },

    // },
    guests: { adults: 0, children: 0, infants: 0 },
  });
  public searchParams$ = this._searchParams$.asObservable();
  private _avgPrice$ = new BehaviorSubject<number>(0);
  public avgPrice$ = this._avgPrice$.asObservable();
  private _lowestPrice$ = new BehaviorSubject<number>(1);
  public lowestPrice$ = this._lowestPrice$.asObservable();
  private _highestPrice$ = new BehaviorSubject<number>(0);
  public highestPrice$ = this._highestPrice$.asObservable();
  public googleMapsAPI = environment.googleMapsAPI;
  public geocodeAPI = environment.geocodeAPI;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private geocodingService: GeocodingService,
    private userService: UserService,
    private ustilService: UtilService
  ) {
    let stays = JSON.parse(localStorage.getItem(ENTITY) || 'null');
    const someStays: Stay[] = [];

    if (!stays || stays.length === 0) {
      stays = this._createStays();
      for (let i = 0; i < 100; i++) someStays.push(stays[i]);

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
      this._stays$.next(someStays);
    }
    this.setAvgPrice(someStays);
  }

  // public initMap() {
  //   console.log('map init');
  // }

  public loadStays(): Observable<Stay[]> {
    return from(storageService.query(ENTITY)).pipe(
      switchMap((stays: Stay[]) => {
        const filterBy = this._stayFilter$.value;
        const searchParams = this._searchParams$.value;

        let filteredStays = this._filter(stays, filterBy);

        return this._search(filteredStays, searchParams).pipe(
          tap((searchedStays: Stay[]) => {
            this.setAvgPrice(searchedStays);
            this.setHigheststPrice(searchedStays);
            this.setLowestPrice(searchedStays);
            const sortedStays = this._sort(searchedStays);
            this._stays$.next(sortedStays);
            this.setStaysWithDistances();
          })
        );
      }),
      retry(1),
      catchError(this._handleError)
    );
  }

  public getStayById(id: string): Observable<Stay> {
    return from(storageService.get(ENTITY, id)).pipe(
      catchError(this._handleError)
    );
  }

  public setStaysWithDistances() {
    combineLatest([
      this.userService.userCoords$,
      this.searchParams$,
      this.stays$,
    ])
      .pipe(take(1))
      .subscribe(([userLoc, searchParams, stays]) => {
        if (!stays || !stays.length) {
          console.log('Stays not available');
          return;
        }

        const targetCoords = this.getTargetCoords(userLoc, searchParams);
        if (!targetCoords) {
          console.log('No location or userLoc available');
          return;
        }

        const distances: StayDistance[] = stays.map((stay) => {
          let { _id } = stay;
          const distance = Math.ceil(
            this.getDistance(stay, targetCoords) / 1000
          );
          return { _id, distance };
        });
        this._distances$.next(distances);
      });
  }

  private getTargetCoords(
    userLoc: {
      lat: number | null;
      lng: number | null;
    },
    searchParams: SearchParam
  ) {
    if (searchParams && searchParams.location && searchParams.location.coords) {
      return searchParams.location.coords;
    } else if (userLoc && userLoc.lat !== null && userLoc.lng !== null) {
      return userLoc;
    }
    return null;
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

  public saveStay(stay: Stay): Observable<Stay> {
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
    if (searchParam.startDate)
      searchParam.startDate = new Date(searchParam.startDate);
    if (searchParam.endDate)
      searchParam.endDate = new Date(searchParam.endDate);
    if (searchParam.location && searchParam.location.name) {
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
            this.updateQueryParams({ search: JSON.stringify(searchParam) });
          }),
          catchError(this._handleError)
        )
        .subscribe();
    } else {
      this._searchParams$.next({ ...searchParam });
      this.loadStays().pipe(take(1)).subscribe();
      this.updateQueryParams({ search: JSON.stringify(searchParam) });
    }
  }

  public setFilter(stayFilter: StayFilter) {
    this._stayFilter$.next({ ...stayFilter });
    this.loadStays().pipe(take(1)).subscribe();

    this.updateQueryParams({ stayFilter: JSON.stringify(stayFilter) });
  }

  private updateQueryParams(params: { [key: string]: string }) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
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

  public getDistance(stay: Stay, coords: any) {
    return getDistance(
      { latitude: stay.loc.lat, longitude: stay.loc.lng },
      { latitude: coords.lat, longitude: coords.lng }
    );
  }

  public getAllHostStaysById(hostId: string): Observable<Stay[]> {
    return this.stays$.pipe(
      take(1),
      map((stays: Stay[]) => stays.filter((stay) => stay.host._id === hostId))
    );
  }

  public findHostById(id: string): Observable<StayHost | null> {
    return this.stays$.pipe(
      take(1),
      map((stays: Stay[]) => {
        const stay = stays.find((stay: Stay) => stay.host._id === id);
        if (stay && stay.host) {
          return stay.host;
        } else {
          return null;
        }
      })
    );
  }

  private _search(
    stays: Stay[],
    searchParams: SearchParam
  ): Observable<Stay[]> {
    let searchedStays = stays;

    if (searchParams.guests && searchParams.guests.adults) {
      searchedStays = stays.filter(
        (stay) =>
          stay.capacity >=
          searchParams.guests.adults + searchParams.guests.children
      );
    }

    if (
      searchParams.location &&
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

  private _updateStay(stay: Stay): Observable<Stay> {
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

  private _addStay(stay: Stay): Observable<Stay> {
    const newStay = Stay.fromObject(stay);
    if (typeof newStay.setId === 'function')
      newStay.setId(this.ustilService.getRandomId());
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

  private _filter(stays: Stay[], filterBy: StayFilter): Stay[] {
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
          (stay) => stay.equipment.bathNum! >= filterBy.equipment.bathNum!
        );
      }

      if (filterBy.equipment.bedsNum) {
        filteredStays = filteredStays.filter(
          (stay) => stay.equipment.bedsNum! >= filterBy.equipment.bedsNum!
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

  private _countFilters(filterBy: StayFilter) {
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
    console.log('error in stay service:', err);
    return throwError(() => err);
  }
}
