import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { staysGuard } from './stays.guard';

describe('staysGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => staysGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
