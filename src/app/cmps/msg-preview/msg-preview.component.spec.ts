import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgPreviewComponent } from './msg-preview.component';

describe('MsgPreviewComponent', () => {
  let component: MsgPreviewComponent;
  let fixture: ComponentFixture<MsgPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MsgPreviewComponent]
    });
    fixture = TestBed.createComponent(MsgPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
