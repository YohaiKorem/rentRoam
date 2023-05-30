import { Component, HostBinding, OnInit } from '@angular/core';
import { Observable, Subscription, map, Subject, takeUntil } from 'rxjs';
import { UserService } from '../services/user.service';
import { StayService } from '../services/stay.service';
import { Stay } from '../models/stay.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    class: 'main-container',
  },
})
export class AppComponent {
  constructor(private stayService: StayService, public router: Router) {}
  subscription!: Subscription;
  private destroySubject$ = new Subject<null>();
  location: any | null = null;
  stays: Stay[] | null = null;
  stays$!: Observable<Stay[]>;
  currentUrl!: string;
  ngOnInit(): void {
    this.stayService.loadStays().subscribe({
      error: (err) => console.log('err', err),
    });
    this.stayService.searchParams$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((searchParam) => (this.location = searchParam.location));
    this.stays$ = this.stayService.stays$;
  }

  isHomePage() {
    return this.router.url === '/stay';
  }

  toggleScrolling(ev: any) {
    console.log(ev);
  }
}
