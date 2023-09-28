import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripPreviewComponent } from './trip-preview.component';

describe('TripPreviewComponent', () => {
  let component: TripPreviewComponent;
  let fixture: ComponentFixture<TripPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripPreviewComponent]
    });
    fixture = TestBed.createComponent(TripPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
