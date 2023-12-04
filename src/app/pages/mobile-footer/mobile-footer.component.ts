import { Component, OnInit } from '@angular/core';
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
import { Unsub } from 'src/app/services/unsub.class';
@Component({
  selector: 'mobile-footer',
  templateUrl: './mobile-footer.component.html',
  styleUrls: ['./mobile-footer.component.scss'],
})
export class MobileFooterComponent extends Unsub implements OnInit {
  user: User | null = null;
  user$!: Observable<User>;
  faSearch = faSearch;
  faMessage = faMessage;
  faDashboard = faDashboard;
  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    public router: Router
  ) {
    super();
  }
  ngOnInit() {
    this.userService.loggedInUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => {
        this.user = user;
      });
  }

  onToggleSignUpModal() {
    this.sharedService.toggleSignUpModal();
  }
}
