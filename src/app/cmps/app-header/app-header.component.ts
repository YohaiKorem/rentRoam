import { Component } from '@angular/core';
import { faAirbnb } from '@fortawesome/free-brands-svg-icons';
@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  host: {
    class: 'main-header main-layout',
  },
})
export class AppHeaderComponent {
  faAirbnb = faAirbnb;
}
