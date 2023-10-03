import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { orderResolver } from './order.resolver';

describe('orderResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => orderResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
