import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StayPreviewLoaderComponent } from './stay-preview-loader.component';

describe('StayPreviewLoaderComponent', () => {
  let component: StayPreviewLoaderComponent;
  let fixture: ComponentFixture<StayPreviewLoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StayPreviewLoaderComponent]
    });
    fixture = TestBed.createComponent(StayPreviewLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
