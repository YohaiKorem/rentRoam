import { Component, OnInit } from '@angular/core';
import {
  faPlusCircle,
  faHouse,
  faList,
  faPencil,
  faEllipsisH,
} from '@fortawesome/free-solid-svg-icons';
import { Subject, take, takeUntil } from 'rxjs';

import { Stay } from 'src/app/models/stay.model';
import { User } from 'src/app/models/user.model';
import { StayService } from 'src/app/services/stay.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private ngUnsubscribe = new Subject<void>();
  faPlusCircle = faPlusCircle;
  faHouse = faHouse;
  faList = faList;
  faPencil = faPencil;
  faEllipsisH = faEllipsisH;
  stays: Stay[] = [];
  user!: User;
  orders = [];
  currCmp: string = 'stays';
  constructor(
    private userService: UserService,
    private stayService: StayService
  ) {}

  ngOnInit(): void {
    this.userService.loggedInUser$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        this.user = user!;
        this.stayService
          .getAllHostStaysById(this.user._id)
          .pipe(take(1))
          .subscribe((stays) => (this.stays = stays));
      });
  }

  onUpdateStay() {}
}
