import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelLoaderComponent } from './label-loader.component';

describe('LabelLoaderComponent', () => {
  let component: LabelLoaderComponent;
  let fixture: ComponentFixture<LabelLoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabelLoaderComponent]
    });
    fixture = TestBed.createComponent(LabelLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
