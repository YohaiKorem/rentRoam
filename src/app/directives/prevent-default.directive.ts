import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPreventDefault]',
})
export class PreventDefaultDirective {
  @HostListener('click', ['$event'])
  public onClick(event: Event): void {
    event.preventDefault();
  }
}
