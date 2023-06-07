import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  private openFilterModalSource = new Subject<void>();
  openFilterModal$ = this.openFilterModalSource.asObservable();
  private openSearchMenuSource = new Subject<void>();
  openSearchMenu$ = this.openSearchMenuSource.asObservable();
  openFilterModal() {
    this.openFilterModalSource.next();
  }

  openSearchMenu() {
    this.openSearchMenuSource.next();
  }
}
