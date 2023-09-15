import { Component } from '@angular/core';
import {
  faPlusCircle,
  faHouse,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { Stay } from 'src/app/models/stay.model';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  faPlusCircle = faPlusCircle;
  faHouse = faHouse;
  faList = faList;
  stays: Stay[] = [];
}
