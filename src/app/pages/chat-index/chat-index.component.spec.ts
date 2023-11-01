import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatIndexComponent } from './chat-index.component';

describe('ChatIndexComponent', () => {
  let component: ChatIndexComponent;
  let fixture: ComponentFixture<ChatIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatIndexComponent]
    });
    fixture = TestBed.createComponent(ChatIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
