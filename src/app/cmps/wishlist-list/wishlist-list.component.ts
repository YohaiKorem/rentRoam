import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Wishlist } from 'src/app/models/wishlist.model';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'wishlist-list',
  templateUrl: './wishlist-list.component.html',
  styleUrls: ['./wishlist-list.component.scss'],
})
export class WishlistListComponent implements OnInit {
  // @Input() wishlist!: Wishlist;
  @Input() user!: User;
  @Input() isModal: boolean = false;
  private destroySubject$ = new Subject<null>();

  constructor(
    private sharedService: SharedService,
    private userService: UserService
  ) {}
  ngOnInit(): void {}
}
