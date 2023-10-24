import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  elHeader = document.querySelector('.main-header');
  isEditMode: boolean = false;
  loggedInUser: User | null = null;
  loggedInUser$!: Observable<User>;
  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.userService.loggedInUser$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((user) => {
        this.loggedInUser = user;
      });
    this.elHeader?.classList.add('hidden-on-mobile');
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.elHeader?.classList.remove('hidden-on-mobile');
  }
}
