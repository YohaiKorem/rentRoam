import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  private openFilterModalSource = new Subject<void>();
  openFilterModal$ = this.openFilterModalSource.asObservable();

  openFilterModal() {
    this.openFilterModalSource.next();
  }
}
