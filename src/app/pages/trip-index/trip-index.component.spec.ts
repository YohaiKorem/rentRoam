import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripIndexComponent } from './trip-index.component';

describe('TripIndexComponent', () => {
  let component: TripIndexComponent;
  let fixture: ComponentFixture<TripIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripIndexComponent]
    });
    fixture = TestBed.createComponent(TripIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
