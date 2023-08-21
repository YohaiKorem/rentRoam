import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}
  private toggleSignupModalSource = new Subject<void>();
  toggleSignupModal$ = this.toggleSignupModalSource.asObservable();
  private openFilterModalSource = new Subject<void>();
  openFilterModal$ = this.openFilterModalSource.asObservable();
  private openSearchMenuSource = new Subject<void>();
  openSearchMenu$ = this.openSearchMenuSource.asObservable();
  private openSearchMenuMobileSource = new Subject<void>();
  openSearchMenuMobile$ = this.openSearchMenuMobileSource.asObservable();
  openFilterModal() {
    this.openFilterModalSource.next();
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
}
