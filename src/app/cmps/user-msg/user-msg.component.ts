import { Component, OnInit } from '@angular/core';
import { Observable, delay, of, skip, takeUntil, tap } from 'rxjs';
import { Unsub } from 'src/app/services/unsub.class';
import { UserMsgService } from 'src/app/services/user-msg.service';

@Component({
  selector: 'user-msg',
  templateUrl: './user-msg.component.html',
  styleUrls: ['./user-msg.component.scss'],
})
export class UserMsgComponent extends Unsub implements OnInit {
  msg$!: Observable<string>;
  msg!: string;

  isShowMsg: boolean = false;
  constructor(private userMsgService: UserMsgService) {
    super();
  }
  ngOnInit(): void {
    this.msg$ = this.userMsgService.msg$;
    this.msg$
      .pipe(
        skip(1),
        takeUntil(this.unsubscribe$),
        tap((msg) => {
          this.isShowMsg = true;
          this.msg = msg;
        }),
        delay(4000),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((msg) => {
        this.hideMsg();
      });
  }

  hideMsg() {
    this.isShowMsg = false;
  }
}
