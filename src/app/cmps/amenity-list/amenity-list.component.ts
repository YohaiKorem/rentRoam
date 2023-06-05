import { Component, Input } from '@angular/core';

@Component({
  selector: 'amenity-list',
  templateUrl: './amenity-list.component.html',
  styleUrls: ['./amenity-list.component.scss'],
})
export class AmenityListComponent {
  @Input() amenities!: string[];
}
