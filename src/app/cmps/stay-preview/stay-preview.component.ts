import { Component, Input, OnInit } from '@angular/core';
import { Stay } from 'src/app/models/stay.model';

@Component({
  selector: 'stay-preview',
  templateUrl: './stay-preview.component.html',
  styleUrls: ['./stay-preview.component.scss'],
})
export class StayPreviewComponent implements OnInit {
  @Input() stay!: Stay;
  isFirstElementInView = true;
  isLastElementInView = false;
  currImgUrl = 0;

  ngOnInit() {
    this.checkInView();
  }

  scrollToLeft(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.currImgUrl =
      this.currImgUrl === 0 ? this.currImgUrl : this.currImgUrl - 1;
    this.checkInView();
  }

  scrollToRight(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.currImgUrl =
      this.currImgUrl === this.stay.imgUrls.length - 1
        ? this.currImgUrl
        : this.currImgUrl + 1;
    this.checkInView();
  }

  checkInView() {
    this.isFirstElementInView = this.currImgUrl === 0 ? true : false;
    this.isLastElementInView =
      this.currImgUrl === this.stay?.imgUrls.length - 1 ? true : false;
  }
}
