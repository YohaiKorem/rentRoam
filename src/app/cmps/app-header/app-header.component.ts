import { Component } from '@angular/core';
import { faAirbnb } from '@fortawesome/free-brands-svg-icons';
import {
  faSearch,
  faGlobe,
  faBars,
  faTentArrowLeftRight,
} from '@fortawesome/free-solid-svg-icons';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  host: {
    class: 'main-header ',
  },
})
export class AppHeaderComponent {
  faAirbnb = faAirbnb;
  faSearch = faSearch;
  faGlobe = faGlobe;
  faBars = faBars;

  constructor(private sharedService: SharedService) {}

  openFilterModal() {
    this.sharedService.openFilterModal();
  }
}
