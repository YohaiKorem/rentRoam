import {
  Directive,
  ElementRef,
  EventEmitter,
  Output,
  Input,
  SimpleChanges,
} from '@angular/core';

declare var google: any;

@Directive({
  selector: '[googlePlacesAutocomplete]',
})
export class GooglePlacesAutocompleteDirective {
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @Input() typeRestriction: string = '';
  @Input() countryRestriction: string = '';
  private autocomplete: any;

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit() {
    const options: any = {
      types: ['(regions)'], // This is a default type; you can adjust as needed
    };

    if (this.countryRestriction && this.countryRestriction.trim() !== '') {
      options.componentRestrictions = { country: this.countryRestriction };
    }

    this.autocomplete = new google.maps.places.Autocomplete(
      this.elRef.nativeElement,
      options
    );

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      this.onSelect.emit(place);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes[this.countryRestriction] && this.autocomplete) {
      this.autocomplete.setComponentRestrictions({
        country: this.countryRestriction,
      });
    }
  }
}
