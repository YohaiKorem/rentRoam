import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StayPreviewComponent } from './stay-preview.component';

describe('StayPreviewComponent', () => {
  let component: StayPreviewComponent;
  let fixture: ComponentFixture<StayPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StayPreviewComponent]
    });
    fixture = TestBed.createComponent(StayPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
