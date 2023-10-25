import { Component, Input } from '@angular/core';
import { TrackByService } from 'src/app/services/track-by.service';

@Component({
  selector: 'amenity-list',
  templateUrl: './amenity-list.component.html',
  styleUrls: ['./amenity-list.component.scss'],
})
export class AmenityListComponent {
  @Input() amenities!: string[];
  constructor(public trackByService: TrackByService) {}
}
