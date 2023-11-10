import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, map } from 'rxjs';
import { Stay } from '../models/stay.model';
const BASE_URL = 'stay';

@Injectable({
  providedIn: 'root',
})
export class StayServiceRemote {
  constructor(private httpService: HttpService) {}

  query(): Observable<Stay[]> {
    return this.httpService
      .get(BASE_URL)
      .pipe(map((data: any) => data as Stay[]));
  }
}
