import {
  Component,
  ViewChild,
  ElementRef,
  Renderer2,
  Output,
  EventEmitter,
} from '@angular/core';
import { StayFilter } from 'src/app/models/stay.model';
import { StayService } from 'src/app/services/stay.service';
import { Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { Btn } from 'src/app/models/btn.model';
import { SharedService } from 'src/app/services/shared.service';
import { LabelService } from 'src/app/services/label.service';
import { Label } from 'src/app/models/label.model';
@Component({
  selector: 'radio-filter',
  templateUrl: './radio-filter.component.html',
  styleUrls: ['./radio-filter.component.scss'],
})
export class RadioFilterComponent {
  constructor(
    private stayService: StayService,
    private sharedService: SharedService,
    private labelService: LabelService
  ) {}
  @Output() toggleFilterModal = new EventEmitter();

  stayFilter = {} as StayFilter;
  private filterSubject$ = new Subject<string>();
  private destroySubject$ = new Subject<null>();
  isFirstElementInView: boolean = true;
  isLastElementInView: boolean = false;
  selectedLabel: string = '';
  filterCount: number = 0;
  labels!: Label[];
  isImgLoaded: { [index: number]: boolean } = {};
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  private scrollAmount = 500;

  ngOnInit() {
    this.labelService.labels$.pipe(take(1)).subscribe((labels) => {
      this.labels = labels;
    });

    this.stayService.stayFilter$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((stayFilter) => {
        this.stayFilter = stayFilter;
      });

    this.filterSubject$
      .pipe(takeUntil(this.destroySubject$), debounceTime(500))
      .subscribe(() => {
        this.stayService.setFilter(this.stayFilter);
      });
    this.stayService.filterCount$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((filterCount) => {
        this.filterCount = filterCount;
      });
  }

  ngAfterViewInit() {
    this.scrollContainer.nativeElement.addEventListener(
      'scroll',
      this.onScroll.bind(this)
    );
  }

  checkElementInView(element: HTMLElement, container: HTMLElement): boolean {
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    return (
      elementRect.top >= containerRect.top &&
      elementRect.left >= containerRect.left &&
      elementRect.bottom <= containerRect.bottom &&
      elementRect.right <= containerRect.right
    );
  }

  scrollToLeft() {
    this.scrollContainer.nativeElement.scrollTo({
      left: this.scrollContainer.nativeElement.scrollLeft - this.scrollAmount,
      behavior: 'smooth',
    });
    this.isLastElementInView = false;
  }

  scrollToRight() {
    this.scrollContainer.nativeElement.scrollTo({
      left: this.scrollContainer.nativeElement.scrollLeft + this.scrollAmount,
      behavior: 'smooth',
    });
    this.isFirstElementInView = false;
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;

    if (target.scrollLeft === 0) {
      this.handleScrollCompletelyToLeft();
    }

    if (
      Math.floor(target.scrollWidth - target.scrollLeft) === target.clientWidth
    ) {
      this.handleScrollCompletelyToRight();
    }
  }

  handleScrollCompletelyToLeft() {
    this.isFirstElementInView = true;
  }
  handleScrollCompletelyToRight() {
    this.isLastElementInView = true;
  }

  filterStaysByLabel(ev: any) {
    // this.applyLabelStyles(ev.target.labels[0]);
    this.selectedLabel = ev.target.labels[0].innerText;
    this.stayFilter.labels[0] = this.selectedLabel;
    this.stayService.setFilter(this.stayFilter);
  }

  applyLabelStyles(label: HTMLLabelElement) {
    // this is a workaround because of copying 61 label elements, usuaslly i would rather use ngClass
    let labelObjs = [];
    let res: any = [];
    const imgsNodeList = document.querySelectorAll('label img');
    let imgs = Array.from(imgsNodeList).map(
      (img) => (img as HTMLImageElement).currentSrc
    );

    // document
    //   .querySelectorAll('label')
    //   .forEach((label) => res.push(label.innerText));
    // document
    //   .querySelectorAll('label')
    //   .forEach((label) => label.classList.remove('active'));
    // label.classList.add('active');

    for (let i = 0; i < res.length; i++) {
      const labelObj = { txt: res[i], src: imgs[i] };

      labelObjs.push(labelObj);
    }
  }

  onImgLoad(labelTxt: string, idx: number) {
    const labelElement = document.querySelector(
      `[data-label-txt="${labelTxt}"]`
    );
    labelElement?.classList.remove('loading');
    this.isImgLoaded[idx] = true;
  }

  openFilterModal() {
    // this.sharedService.openFilterModal();
    this.sharedService.openModal('Filters');
  }

  ngOnDestroy(): void {
    this.destroySubject$.next(null);
    this.destroySubject$.unsubscribe();
  }
}
