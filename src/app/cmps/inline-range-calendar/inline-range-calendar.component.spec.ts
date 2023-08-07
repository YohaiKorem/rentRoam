import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineRangeCalendarComponent } from './inline-range-calendar.component';

describe('InlineRangeCalendarComponent', () => {
  let component: InlineRangeCalendarComponent;
  let fixture: ComponentFixture<InlineRangeCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InlineRangeCalendarComponent]
    });
    fixture = TestBed.createComponent(InlineRangeCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
