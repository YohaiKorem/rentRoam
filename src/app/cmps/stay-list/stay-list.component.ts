import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  HostListener,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Stay, StayDistance } from 'src/app/models/stay.model';

@Component({
  selector: 'stay-list',
  templateUrl: './stay-list.component.html',
  styleUrls: ['./stay-list.component.scss'],
})
export class StayListComponent implements AfterViewInit, OnDestroy {
  @Input() stays!: Stay[] | null;
  @Input() distances!: StayDistance[] | null;
  @Input() userLoc!: { lat: number | null; lng: number | null };
  @Input() areMonthsDifferent: boolean = false;
  @Input() endMonth: string = '';
  @Input() currDate: { start: Date; end: Date } = {
    start: new Date(),
    end: new Date(),
  };
  @Output() clearFilter = new EventEmitter();
  staysWithDistance: any;

  private ro: ResizeObserver;

  constructor(private cdr: ChangeDetectorRef, private el: ElementRef) {
    this.ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        this.updateGridColumns(entry.target as HTMLElement);
      }
    });
  }

  ngAfterViewInit(): void {
    this.updateGridColumns(this.el.nativeElement as HTMLElement);
    if (this.el.nativeElement.parentElement) {
      this.ro.observe(this.el.nativeElement.parentElement);
    }
  }

  ngOnDestroy(): void {
    this.ro.disconnect();
  }

  onClearFilter() {
    this.clearFilter.emit();
  }

  private updateGridColumns(element: HTMLElement): void {
    if (!element.parentElement) return;

    const gridList = document.querySelector('.stay-list') as HTMLElement;
    if (!gridList) return;
    const containerWidth = element.offsetWidth;
    let columns;

    if (containerWidth >= 1880) {
      columns = 6;
    } else if (containerWidth >= 1640) {
      columns = 5;
    } else if (containerWidth >= 1128) {
      columns = 4;
    } else if (containerWidth >= 950) {
      columns = 3;
    } else if (containerWidth >= 550) {
      columns = 2;
    } else {
      columns = 1;
    }

    gridList.style.setProperty('--breakpoint-grid-columns', `${columns}`);
  }
}
