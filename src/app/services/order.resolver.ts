import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OrderService } from './order.service';
import { inject } from '@angular/core';
import { delay } from 'rxjs';

export function OrderResolver(route: ActivatedRouteSnapshot) {
  const id = route.params['orderId'];

  return inject(OrderService).getOrderById(id).pipe(delay(10));
}
