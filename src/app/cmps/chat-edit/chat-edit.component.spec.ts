import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatEditComponent } from './chat-edit.component';

describe('ChatEditComponent', () => {
  let component: ChatEditComponent;
  let fixture: ComponentFixture<ChatEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatEditComponent]
    });
    fixture = TestBed.createComponent(ChatEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
