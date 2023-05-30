import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { delay } from 'rxjs';
import { StayService } from './stay.service';

export function StayResolver(route: ActivatedRouteSnapshot) {
  const id = route.params['id'];

  return inject(StayService).getStayById(id).pipe(delay(10));
}
