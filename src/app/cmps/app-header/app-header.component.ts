import { Component, ViewChild } from '@angular/core';
import { faAirbnb } from '@fortawesome/free-brands-svg-icons';
import {
  faSearch,
  faGlobe,
  faBars,
  faTentArrowLeftRight,
} from '@fortawesome/free-solid-svg-icons';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuTrigger } from '@angular/material/menu';

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
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  faAirbnb = faAirbnb;
  faSearch = faSearch;
  faGlobe = faGlobe;
  faBars = faBars;

  constructor(private sharedService: SharedService) {}

  openFilterModal() {
    this.sharedService.openFilterModal();
  }
  openSearch(str: string) {
    console.log(this.trigger);
    this.trigger.openMenu();
  }
}
