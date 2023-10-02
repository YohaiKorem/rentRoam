import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgListComponent } from './msg-list.component';

describe('MsgListComponent', () => {
  let component: MsgListComponent;
  let fixture: ComponentFixture<MsgListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MsgListComponent]
    });
    fixture = TestBed.createComponent(MsgListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
