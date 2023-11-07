import { Component, Input, OnInit } from '@angular/core';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'share-menu',
  templateUrl: './share-menu.component.html',
  styleUrls: ['./share-menu.component.scss'],
})
export class ShareMenuComponent implements OnInit {
  constructor(private sharedService: SharedService) {}
  @Input() url!: string;

  ngOnInit(): void {
    this.sharedService.addStyleToElement(
      'dynamic-modal',
      'height',
      'fit-content'
    );
    this.sharedService.showElementOnMobile(
      'button.btn.btn-close.hidden-on-mobile'
    );
  }
}
