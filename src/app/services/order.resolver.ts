import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OrderService } from './order.service';
import { inject } from '@angular/core';
import { delay } from 'rxjs';

export function OrderResolver(route: ActivatedRouteSnapshot) {
  const orderId = route.params['orderId'];

  return inject(OrderService).getOrderById(orderId).pipe(delay(10));
}
