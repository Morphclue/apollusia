import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-location-link',
  templateUrl: './location-link.component.html',
  styleUrls: ['./location-link.component.scss'],
  standalone: false,
})
export class LocationLinkComponent implements OnChanges {
  @Input() location!: string;
  @Input() shorten = false;

  shortLink?: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['location']) {
      if (this.shorten) {
        try {
          const url = new URL(this.location);
          this.shortLink = url.hostname + url.pathname;
        } catch {
          this.shortLink = this.location;
        }
      } else {
        this.shortLink = this.location;
      }
    }
  }
}
