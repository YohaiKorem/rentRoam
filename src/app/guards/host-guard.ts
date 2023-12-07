import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { StayService } from '../services/stay.service';

@Injectable({
  providedIn: 'root',
})
export class HostGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private stayService: StayService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const stayId = route.params['stayId'];

    const user = this.userService.getLoggedInUser();
    if (!user) {
      return of(false);
    }
    return this.stayService.getStayById(stayId).pipe(
      take(1),
      map((stay) => {
        if (stay && stay.host._id === user._id) {
          route.data = { ...route.data, fetchedStay: stay }; // Set the stay in the data

          return true;
        } else {
          return this.router.createUrlTree(['/']);
        }
      }),
      catchError((err) => {
        console.log(err);
        return of(this.router.createUrlTree(['/']));
      })
    );
  }
}
