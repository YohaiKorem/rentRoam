import { Component, HostBinding, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { StayService } from '../services/stay.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    class: 'main-container',
  },
})
export class AppComponent {
  constructor(private stayService: StayService) {}

  ngOnInit(): void {
    this.stayService.loadStays().subscribe({
      error: (err) => console.log('err', err),
    });
    // this.bitcoinService.fetchData();
  }
}
