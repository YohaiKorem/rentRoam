import { Component, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'wishlist-index',
  templateUrl: './wishlist-Index.component.html',
  styleUrls: ['./wishlist-Index.component.scss'],
})
export class WishlistIndexComponent implements OnInit {
  private destroySubject$ = new Subject<null>();

  loggedInUser: User | null = null;
  loggedInUser$!: Observable<User>;
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.userService.loggedInUser$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((user) => {
        this.loggedInUser = user;
      });
  }
}
