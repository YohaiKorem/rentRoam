import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreviewComponent } from './order-preview.component';

describe('OrderPreviewComponent', () => {
  let component: OrderPreviewComponent;
  let fixture: ComponentFixture<OrderPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderPreviewComponent]
    });
    fixture = TestBed.createComponent(OrderPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
