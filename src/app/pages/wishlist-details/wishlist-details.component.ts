import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Observable, Subscription, map, takeUntil, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'wishlist-details',
  templateUrl: './wishlist-details.component.html',
  styleUrls: ['./wishlist-details.component.scss'],
})
export class WishlistDetailsComponent implements OnInit {
  user: User | null = null;
  user$!: Observable<User>;
  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.user$ = this.route.data.pipe(
      map((data) => {
        this.user = data['user'];
        return data['user'];
      })
    );
    console.log(this.user);
    console.log(this.user$);
  }
}
