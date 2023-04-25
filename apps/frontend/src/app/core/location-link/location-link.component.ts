import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-location-link',
  templateUrl: './location-link.component.html',
  styleUrls: ['./location-link.component.scss'],
})
export class LocationLinkComponent {
  @Input() location!: string;
}
