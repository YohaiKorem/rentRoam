import {
  Component,
  HostBinding,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Observable, Subscription, map, Subject, takeUntil } from 'rxjs';
import { UserService } from '../services/user.service';
import { StayService } from '../services/stay.service';
import { Stay } from '../models/stay.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Cloudinary } from '@cloudinary/url-gen';
import { environment } from 'src/environments/env.prod';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    class: 'main-container',
  },
})
export class AppComponent {
  constructor(
    private stayService: StayService,
    public router: Router,
    private userService: UserService
  ) {}
  subscription!: Subscription;
  private destroySubject$ = new Subject<null>();
  location: any | null = null;
  stays: Stay[] | null = null;
  stays$!: Observable<Stay[]>;
  currentUrl!: string;
  userLoc: any = { lat: null, lng: null };

  ngOnInit(): void {
    this.stayService.loadStays().subscribe({
      error: (err) => console.log('err', err),
    });
    this.stayService.searchParams$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((searchParam) => (this.location = searchParam.location));
    this.stays$ = this.stayService.stays$;
  }

  ngAfterViewInit() {
    this.userService.getUserLoc();
  }

  onScroll(event: any) {
    event.stopPropagation();

    const scrollPosition = event.target.scrollTop;

    const elStayIndex = document.querySelector(
      '.map-active stay-index'
    ) as HTMLElement;
    if (elStayIndex && scrollPosition <= 200) {
      elStayIndex!.style.transform = `translateY(${-scrollPosition}px)`;
      console.log('hi');
    }

    // elStayIndex.style.height = `${206 + scrollPosition}px`;
  }

  isHomePage() {
    return this.router.url === '/stay';
  }
}
