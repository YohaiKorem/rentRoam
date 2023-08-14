import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss'],
})
export class SignupModalComponent {
  constructor(private userService: UserService) {}

  loggedInUser: User | null = null;
  loggedInUser$!: Observable<User>;
  credentials: any = {};
  handleLogIn() {
    this.userService.login(this.credentials).subscribe((user) => {
      this.loggedInUser = user;
    });
  }
  handleLogout() {
    this.loggedInUser = this.userService.logout();
  }
}
