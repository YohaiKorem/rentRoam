import { Component, OnInit } from '@angular/core';
import { Stay } from 'src/app/models/stay.model';
import { User } from 'src/app/models/user.model';
import { StayService } from 'src/app/services/stay.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'stay-edit',
  templateUrl: './stay-edit.component.html',
  styleUrls: ['./stay-edit.component.scss'],
})
export class StayEditComponent implements OnInit {
  user!: User;
  emptyStay: Stay = Stay.getEmptyStay();
  constructor(
    private userService: UserService,
    private stayService: StayService
  ) {}

  ngOnInit(): void {
    this.userService.loggedInUser$.subscribe((user) => (this.user = user!));
    this.emptyStay = Stay.getEmptyStay();
    console.log(this.generateKeys(this.emptyStay));
  }

  generateKeys(stay: Stay) {
    return Object.entries(stay);
  }

  determineType(value: any): string {
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'object' && Array.isArray(value)) return 'array';
    if (typeof value === 'object' && value !== null) return 'object';
    return '';
  }
}
