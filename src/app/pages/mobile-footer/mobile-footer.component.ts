import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import {
  faSearch,
  faMessage,
  faDashboard,
} from '@fortawesome/free-solid-svg-icons';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';
@Component({
  selector: 'mobile-footer',
  templateUrl: './mobile-footer.component.html',
  styleUrls: ['./mobile-footer.component.scss'],
})
export class MobileFooterComponent implements OnInit, OnDestroy {
  private destroySubject$ = new Subject<null>();
  private subscription: Subscription = new Subscription();
  user: User | null = null;
  user$!: Observable<User>;
  faSearch = faSearch;
  faMessage = faMessage;
  faDashboard = faDashboard;
  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    public router: Router
  ) {}
  ngOnInit() {
    this.userService.loggedInUser$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((user) => (this.user = user));
  }

  onToggleSignUpModal() {
    this.sharedService.toggleSignUpModal();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
