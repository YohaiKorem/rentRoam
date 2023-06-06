import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileSearchMenuComponent } from './mobile-search-menu.component';

describe('MobileSearchMenuComponent', () => {
  let component: MobileSearchMenuComponent;
  let fixture: ComponentFixture<MobileSearchMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobileSearchMenuComponent]
    });
    fixture = TestBed.createComponent(MobileSearchMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
