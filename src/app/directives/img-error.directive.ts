import {
  Directive,
  HostListener,
  Input,
  Renderer2,
  ElementRef,
} from '@angular/core';
@Directive({
  selector: '[imgError]',
})
export class ImgErrorDirective {
  @Input() defaultImage: string = 'assets/imgs/airbnbLogo.jpg';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('error') onError() {
    this.renderer.setAttribute(this.el.nativeElement, 'src', this.defaultImage);
  }
}
