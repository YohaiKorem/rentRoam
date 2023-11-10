import { TestBed } from '@angular/core/testing';

import { StayService } from './stay.service.local';

describe('StayServiceService', () => {
  let service: StayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
