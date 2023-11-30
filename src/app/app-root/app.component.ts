import {
  Component,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChild,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import {
  Observable,
  Subscription,
  Subject,
  takeUntil,
  take,
  pipe,
  map,
  fromEvent,
  debounceTime,
} from 'rxjs';
import { UserService } from '../services/user.service';
import { Pagination, Stay } from '../models/stay.model';
import { ActivatedRoute, Router } from '@angular/router';
import { StayService } from '../services/stay.service';
import { Cloudinary } from '@cloudinary/url-gen';
import { environment } from 'src/environments/environment';
import { SharedService } from '../services/shared.service';
import { Unsub } from '../services/unsub.class';
import { SocketService } from '../services/socket.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    class: 'main-container',
  },
})
export class AppComponent extends Unsub {
  @ViewChild('mainContent') mainContent!: ElementRef;
  constructor(
    private activatedRoute: ActivatedRoute,

    private stayService: StayService,
    public router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
    private socketService: SocketService
  ) {
    super();
  }
  private scrollSubscription!: Subscription;
  location: any | null = null;
  stays: Stay[] | null = null;
  stays$!: Observable<Stay[]>;
  pagination: Pagination = {
    pageIdx: 0,
    pageSize: 50,
  };
  currentUrl!: string;
  userLoc: any = { lat: null, lng: null };
  ngOnInit(): void {
    this.stays$ = this.stayService.stays$;
    this.stayService.searchParams$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((searchParam) => (this.location = searchParam.location));
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.unsubscribe$), debounceTime(500))
      .subscribe((queryParams) => {
        const stayFilter = queryParams['stayFilter'];
        const searchParam = queryParams['searchParam'];

        if (stayFilter) {
          this.stayService.setFilter(JSON.parse(stayFilter));
        }
        if (searchParam) {
          this.stayService.setSearchParams(JSON.parse(searchParam));
        }
        this.cdr.detectChanges();
      });
    this.stayService.pagination$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((pagination: Pagination) => {
        this.pagination = pagination;
      });
  }

  ngAfterViewInit() {
    this.userService.getUserLoc();
    document.documentElement.style.setProperty(
      '--full-height',
      `${window.innerHeight}px`
    );
    const scrollObservable = fromEvent(
      this.mainContent.nativeElement,
      'scroll'
    );
    this.scrollSubscription = scrollObservable
      .pipe(takeUntil(this.unsubscribe$), debounceTime(300))
      .subscribe((event) => {
        this.onScroll(event);
      });
  }

  onScroll(event: any) {
    event.stopPropagation();

    this.loadMoreStays(event);
    this.onScrollWithMap(event);
  }

  loadMoreStays(event: any) {
    const elLastChild = event.target.lastElementChild;
    const elStayIndex = document.querySelector('stay-index');
    if (elLastChild === elStayIndex) {
      const { scrollTop, scrollHeight } = event.target;
      if (scrollTop * 1.5 >= scrollHeight) {
        this.pagination.pageIdx++;
        this.stayService.setPagination(this.pagination);
      }
    }
  }

  onScrollWithMap(event: any) {
    const scrollPosition = event.target.scrollTop;

    const elStayIndex = document.querySelector(
      '.map-active stay-index'
    ) as HTMLElement;
    if (elStayIndex && scrollPosition <= 200) {
      elStayIndex!.style.transform = `translateY(${-scrollPosition}px)`;
    }
  }
}
