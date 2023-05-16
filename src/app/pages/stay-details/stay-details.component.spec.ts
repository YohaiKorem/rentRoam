import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StayDetailsComponent } from './stay-details.component';

describe('StayDetailsComponent', () => {
  let component: StayDetailsComponent;
  let fixture: ComponentFixture<StayDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StayDetailsComponent]
    });
    fixture = TestBed.createComponent(StayDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
