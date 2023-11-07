import { Component, Input } from '@angular/core';

@Component({
  selector: 'share-menu',
  templateUrl: './share-menu.component.html',
  styleUrls: ['./share-menu.component.scss'],
})
export class ShareMenuComponent {
  @Input() url: string = '';
}
