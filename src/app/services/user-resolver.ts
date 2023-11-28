import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { debounceTime, delay } from 'rxjs';
import { UserService } from './user.service';

export function UserResolver(route: ActivatedRouteSnapshot) {
  const userId = route.params['userId'];
  const wishlistId = route.params['wishlistId'];
  console.log(userId);

  return inject(UserService)
    .getUserById(userId)
    .pipe(debounceTime(500), delay(10));
}
