import {
  Component,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Observable, Subscription, Subject, takeUntil, take, pipe } from 'rxjs';
import { UserService } from '../services/user.service';
import { Stay } from '../models/stay.model';
import { ActivatedRoute, Router } from '@angular/router';
import { StayService } from '../services/stay.service';
import { Cloudinary } from '@cloudinary/url-gen';
import { environment } from 'src/environments/environment';
import { SharedService } from '../services/shared.service';
import { HttpClient } from '@angular/common/http';
import { Unsub } from '../services/unsub.class';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    class: 'main-container',
  },
})
export class AppComponent extends Unsub {
  constructor(
    private activatedRoute: ActivatedRoute,

    private stayService: StayService,
    public router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
    private httpClient: HttpClient
  ) {
    super();
  }
  subscription!: Subscription;
  location: any | null = null;
  stays: Stay[] | null = null;
  stays$!: Observable<Stay[]>;
  currentUrl!: string;
  userLoc: any = { lat: null, lng: null };
  ngOnInit(): void {
    this.stays$ = this.stayService.stays$;
    this.stayService.searchParams$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((searchParam) => (this.location = searchParam.location));
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((queryParams) => {
        const stayFilter = queryParams['stayFilter'];
        const search = queryParams['search'];
        console.log(search);

        if (stayFilter) {
          this.stayService.setFilter(JSON.parse(stayFilter));
        }
        if (search) {
          this.stayService.setSearchParams(JSON.parse(search), 'great');
        }
      });
  }

  ngAfterViewInit() {
    this.userService.getUserLoc();
    document.documentElement.style.setProperty(
      '--full-height',
      `${window.innerHeight}px`
    );
  }

  onScroll(event: any) {
    event.stopPropagation();

    const scrollPosition = event.target.scrollTop;

    const elStayIndex = document.querySelector(
      '.map-active stay-index'
    ) as HTMLElement;
    if (elStayIndex && scrollPosition <= 200) {
      elStayIndex!.style.transform = `translateY(${-scrollPosition}px)`;
    }
  }
}
