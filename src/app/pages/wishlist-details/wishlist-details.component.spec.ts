import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistDetailsComponent } from './wishlist-details.component';

describe('WishlistDetailsComponent', () => {
  let component: WishlistDetailsComponent;
  let fixture: ComponentFixture<WishlistDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WishlistDetailsComponent]
    });
    fixture = TestBed.createComponent(WishlistDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
