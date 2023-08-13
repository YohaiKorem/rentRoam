// swipe.directive.ts
import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appSwipe]',
})
export class SwipeDirectiveDirective {
  @Output() swipeLeft = new EventEmitter<void>();
  @Output() swipeRight = new EventEmitter<void>();

  startX!: number;
  startY!: number;

  @HostListener('touchstart', ['$event'])
  touchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
    this.startY = event.touches[0].clientY;
  }

  @HostListener('touchend', ['$event'])
  touchEnd(event: TouchEvent) {
    const deltaX = event.changedTouches[0].clientX - this.startX;
    const deltaY = event.changedTouches[0].clientY - this.startY;

    // Determine horizontal swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        this.swipeRight.emit();
      } else {
        this.swipeLeft.emit();
      }
    }
  }
}
