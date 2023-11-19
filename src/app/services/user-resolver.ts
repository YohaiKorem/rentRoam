import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { delay } from 'rxjs';
import { UserService } from './user.service';

export function UserResolver(route: ActivatedRouteSnapshot) {
  const userId = route.params['userId'];
  const wishlistId = route.params['wishlistId'];

  return inject(UserService).getUserById(userId).pipe(delay(10));
}
