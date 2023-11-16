import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import {
  BehaviorSubject,
  Observable,
  map,
  take,
  throwError,
  combineLatest,
  switchMap,
  of,
  tap,
  retry,
  catchError,
  debounceTime,
  delay,
} from 'rxjs';
import { GeocodingService } from './geocoding.service';
import { getDistance } from 'geolib';
import { environment } from 'src/environments/environment';

import {
  SearchParam,
  Stay,
  StayDistance,
  StayFilter,
} from '../models/stay.model';
import { HttpErrorResponse } from '@angular/common/http';
import { StayHost } from '../models/host.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './user.service';
const BASE_URL = 'stay';

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
    private httpService: HttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private geocodingService: GeocodingService,
    private userService: UserService
  ) {
    this.loadStays().subscribe((stays: Stay[]) => {
      this._stays$.next(stays);
    });
  }
  loadStays(): Observable<Stay[]> {
    return combineLatest([this.stayFilter$, this.searchParams$]).pipe(
      tap(([stayFilter, searchParam]) => {}),
      switchMap(([stayFilter, searchParam]) =>
        this.query(stayFilter, searchParam)
      )
    );
  }

  private query(
    stayFilter: StayFilter,
    search: SearchParam
  ): Observable<Stay[]> {
    const filterBy = { ...stayFilter };
    const searchParam = { ...search };
    const data = { ...filterBy, ...searchParam };
    return this.httpService.get(BASE_URL, data).pipe(
      map((data: any) => data as Stay[]),
      debounceTime(500),
      tap((stays: Stay[]) => {
        this.setAvgPrice(stays);
        this.setHigheststPrice(stays);
        this.setLowestPrice(stays);
        this._stays$.next(stays);
        this.setStaysWithDistances();
      }),
      retry(1),
      catchError(this._handleError)
    );
  }
  public getStayById(id: string): Observable<Stay> {
    return this.httpService.get(`${BASE_URL}/${id}`).pipe(
      debounceTime(500),
      map((data: any) => data as Stay)
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
    // console.log('userLoc', userLoc);
    // console.log('searchParams', searchParams);

    if (searchParams && searchParams.location && searchParams.location.coords) {
      return searchParams.location.coords;
    } else if (userLoc && userLoc.lat !== null && userLoc.lng !== null) {
      return userLoc;
    }
    return null;
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
            this.updateQueryParams(
              {
                searchParam: JSON.stringify(searchParam),
              },
              'sent searchParam 1'
            );
            this.loadStays().pipe(take(1)).subscribe();
          }),

          catchError(this._handleError)
        )
        .subscribe();
    } else {
      this._searchParams$.next({ ...searchParam });
      this.updateQueryParams(
        { searchParam: JSON.stringify(searchParam) },
        'sent searchParam 2'
      );
      this.loadStays().pipe(take(1)).subscribe();
    }
  }

  public setFilter(stayFilter: StayFilter) {
    this._stayFilter$.next({ ...stayFilter });

    this.updateQueryParams(
      { stayFilter: JSON.stringify(stayFilter) },
      'sent stayFilter'
    );
    this.loadStays().pipe(take(1)).subscribe();
  }

  private updateQueryParams(params: { [key: string]: string }, debug: string) {
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

  private _handleError(err: HttpErrorResponse) {
    console.log('error in stay service:', err);
    return throwError(() => err);
  }
}
