import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Stay } from '../models/stay.model';
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}
  private toggleSignupModalSource = new Subject<void>();
  toggleSignupModal$ = this.toggleSignupModalSource.asObservable();
  private openModalSource = new Subject<{ str: string; data: Stay | null }>();
  openModal$ = this.openModalSource.asObservable();

  private openSearchMenuSource = new Subject<void>();
  openSearchMenu$ = this.openSearchMenuSource.asObservable();
  private openSearchMenuMobileSource = new Subject<void>();
  openSearchMenuMobile$ = this.openSearchMenuMobileSource.asObservable();
  elHeader = document.querySelector('.main-header');

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

  showHeaderOnMobile() {
    this.elHeader?.classList.remove('hidden-on-mobile');
  }

  hideHeaderOnMobile() {
    this.elHeader?.classList.add('hidden-on-mobile');
  }
}
