import {
  Component,
  EventEmitter,
  Input,
  Output,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Stay } from 'src/app/models/stay.model';

@Component({
  selector: 'stay-list',
  templateUrl: './stay-list.component.html',
  styleUrls: ['./stay-list.component.scss'],
})
export class StayListComponent {
  constructor(private elementRef: ElementRef) {}
  @Input() stays!: Stay[] | null;
  @Output() clearFilter = new EventEmitter();

  // @ViewChild('stayList', { static: false }) stayList!: ElementRef;

  onClearFilter() {
    this.clearFilter.emit();
  }
  // ngAfterViewInit() {
  //   this.attachScrollListener();
  // }

  // attachScrollListener() {
  //   const scrollContainerElement = this.stayList.nativeElement;
  //   console.log(this.stayList.nativeElement);

  //   scrollContainerElement.addEventListener('scroll', this.onScroll.bind(this));
  // }
  // onScroll(event: any) {
  //   console.log(event);

  //   const scrollPosition = event.target.scrollTop;
  //   console.log(scrollPosition);

  //   // const parallaxContainer = document.querySelector('.parallax-container');
  //   // parallaxContainer!.style.transform = `translateY(${scrollPosition * 0.5}px)`;
  // }
  // ngOnDestroy() {
  //   const scrollContainerElement = this.stayList.nativeElement;
  //   scrollContainerElement.removeEventListener(
  //     'scroll',
  //     this.onScroll.bind(this)
  //   );
  // }
}
