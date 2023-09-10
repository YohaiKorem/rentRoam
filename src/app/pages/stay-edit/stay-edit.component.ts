import { Component, OnInit } from '@angular/core';
import { IStay, Labels, Stay, amenities } from 'src/app/models/stay.model';
import { User } from 'src/app/models/user.model';
import { StayHost } from 'src/app/models/host.model';
import { StayService } from 'src/app/services/stay.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'stay-edit',
  templateUrl: './stay-edit.component.html',
  styleUrls: ['./stay-edit.component.scss'],
})
export class StayEditComponent implements OnInit {
  user!: User;
  stay: IStay = Stay.getEmptyStay();
  amenities = amenities;
  allAmenities: string[] = ([] as string[]).concat(
    ...Object.values(this.amenities)
  );
  stayHost!: StayHost;
  labels = Labels;
  hasHost!: boolean;
  constructor(
    private userService: UserService,
    private stayService: StayService
  ) {}

  ngOnInit(): void {
    this.userService.loggedInUser$.subscribe((user) => (this.user = user!));
    if (!this.stay.host.fullname) {
      this.stayHost = StayHost.newHostFromUser(this.user);
      this.hasHost = false;
    } else {
      this.hasHost = true;
    }
  }

  test(str: any) {
    console.log(this.stay);
  }

  onImgUpload(ev: any, idx: number) {
    if (ev.target.files && ev.target.files.length) {
      const file = ev.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.stay.imgUrls[idx] = reader.result as string;
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
    }
  }

  onToggleCheckboxEntity(ev: Event, str: string, entity: string) {
    this.stay[entity].includes(str)
      ? this.stay[entity].filter((e: string) => e === str)
      : this.stay[entity].push(str);
    console.log(this.stay);
  }
}
