import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { StayService } from '../services/stay.service';
import { catchError, first, map } from 'rxjs/operators';
import { of } from 'rxjs';

export const staysGuard: CanActivateFn = (route, state) => {
  const stayService = inject(StayService);
  return stayService.query().pipe(
    first(),
    map(() => true),
    catchError(() => {
      return of(false);
    })
  );
};
