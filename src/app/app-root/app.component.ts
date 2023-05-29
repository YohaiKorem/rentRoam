import { Component, HostBinding, OnInit } from '@angular/core';
import { Observable, Subscription, map, Subject, takeUntil } from 'rxjs';
import { UserService } from '../services/user.service';
import { StayService } from '../services/stay.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    class: 'main-container',
  },
})
export class AppComponent {
  constructor(private stayService: StayService) {}
  subscription!: Subscription;
  private destroySubject$ = new Subject<null>();
  location: string | null = null;

  ngOnInit(): void {
    this.stayService.loadStays().subscribe({
      error: (err) => console.log('err', err),
    });
    this.stayService.searchParams$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((searchParam) => (this.location = searchParam.location));
  }
  toggleScrolling(ev: any) {
    console.log(ev);
  }
}
