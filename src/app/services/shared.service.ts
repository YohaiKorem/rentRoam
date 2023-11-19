import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, of } from 'rxjs';
import { Stay } from '../models/stay.model';
import { environment } from 'src/environments/environment';
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
  toggleClassOnElement(
    selector: string,
    classToBind: string,
    action: 'add' | 'remove' | 'toggle'
  ) {
    document.querySelector(selector)?.classList[action](classToBind);
  }

  addStyleToElement(
    selector: string,
    styleToBind: Partial<keyof CSSStyleDeclaration>,
    styleValue: string
  ) {
    const el = document.querySelector(selector) as HTMLElement;
    if (el && el.style) {
      if (styleToBind in el.style) {
        el.style[styleToBind as any] = styleValue;
      } else {
        console.error('Invalid style property:', styleToBind);
      }
    }
  }
}
