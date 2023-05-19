import {
  Component,
  ViewChild,
  ElementRef,
  Renderer2,
  OnInit,
} from '@angular/core';
@Component({
  selector: 'radio-filter',
  templateUrl: './radio-filter.component.html',
  styleUrls: ['./radio-filter.component.scss'],
})
export class RadioFilterComponent {
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}
  isFirstElementInView: boolean = true;
  isLastElementInView: boolean = false;
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  private scrollAmount = 500;

  ngOnInit() {
    const labels = document.querySelectorAll('label span');
    console.log(labels);
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
      this.handleScrollToRight();
    }
  }

  handleScrollCompletelyToLeft() {
    this.isFirstElementInView = true;
  }
  handleScrollToRight() {
    this.isLastElementInView = true;
  }
}
