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
  @Input() typeRestriction: string = 'country';
  @Input() countryRestriction: string = '';
  @Input() cityRestriction: string = '';
  private autocomplete: any;

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit() {
    const options: any = {
      types: [this.typeRestriction],
    };

    if (this.countryRestriction !== '') {
      options.componentRestrictions = { country: this.countryRestriction };
    }
    if (this.cityRestriction !== '') {
      options.componentRestrictions = {
        country: this.countryRestriction,
        city: this.cityRestriction,
      };
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
    if (changes['countryRestriction'] && this.autocomplete) {
      this.autocomplete.setComponentRestrictions({
        country: this.countryRestriction,
      });
    }
    if (changes['cityRestriction' && this.autocomplete]) {
      this.autocomplete.setComponentRestrictions({
        country: this.countryRestriction,
      });
    }
  }
}
