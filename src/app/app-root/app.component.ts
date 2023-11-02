import {
  Component,
  HostBinding,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import {
  Observable,
  Subscription,
  map,
  Subject,
  takeUntil,
  of,
  catchError,
} from 'rxjs';
import { UserService } from '../services/user.service';
import { StayService } from '../services/stay.service';
import { Stay } from '../models/stay.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Cloudinary } from '@cloudinary/url-gen';
import { environment } from 'src/environments/env.prod';
import { SharedService } from '../services/shared.service';
import { HttpClient } from '@angular/common/http';
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
    private activatedRoute: ActivatedRoute,

    private stayService: StayService,
    public router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
    private httpClient: HttpClient
  ) {
    // this.apiLoaded = httpClient
    //   .jsonp(
    //     `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsAPI}`,
    //     'callback'
    //   )
    //   .pipe(
    //     map(() => true),
    //     catchError(() => of(false))
    //   );
  }
  subscription!: Subscription;
  private destroySubject$ = new Subject<null>();
  location: any | null = null;
  stays: Stay[] | null = null;
  stays$!: Observable<Stay[]>;
  currentUrl!: string;
  userLoc: any = { lat: null, lng: null };
  isHomePage!: boolean;
  ngOnInit(): void {
    this.stayService.loadStays().subscribe({
      error: (err) => console.log('err', err),
    });

    this.activatedRoute.queryParams.subscribe((queryParams) => {
      const filter = queryParams['filter'];
      const search = queryParams['search'];
      if (filter) {
        this.stayService.setFilter(JSON.parse(filter));
      }
      if (search) {
        this.stayService.setSearchParams(JSON.parse(search));
      }
    });

    this.stayService.searchParams$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((searchParam) => (this.location = searchParam.location));
    this.stays$ = this.stayService.stays$;
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

    // elStayIndex.style.height = `${206 + scrollPosition}px`;
  }
}
