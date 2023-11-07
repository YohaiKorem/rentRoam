import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareMenuComponent } from './share-menu.component';

describe('ShareMenuComponent', () => {
  let component: ShareMenuComponent;
  let fixture: ComponentFixture<ShareMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShareMenuComponent]
    });
    fixture = TestBed.createComponent(ShareMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
