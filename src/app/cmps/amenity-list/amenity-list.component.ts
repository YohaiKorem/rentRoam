import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { TrackByService } from 'src/app/services/track-by.service';

@Component({
  selector: 'amenity-list',
  templateUrl: './amenity-list.component.html',
  styleUrls: ['./amenity-list.component.scss'],
})
export class AmenityListComponent {
  @Input() amenities!: string[];
  modalHeader = document.querySelector('.dynamic-modal btn-close');
  constructor(
    public trackByService: TrackByService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.modalHeader?.classList.remove('hidden-on-mobile');
  }
}
