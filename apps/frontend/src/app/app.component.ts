import {Component, Inject, OnInit, Optional} from '@angular/core';
import {Meta} from '@angular/platform-browser';
import {SwUpdate} from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  title = 'apollusia';

  constructor(
    private swUpdate: SwUpdate,
    private meta: Meta,
    @Optional() @Inject('BASE_URL') private baseUrl?: string,
  ) {
  }

  ngOnInit(): void {
    this.baseUrl && this.meta.updateTag({property: 'og:image', content: `${this.baseUrl}/assets/logo.png`});

    this.swUpdate.versionUpdates.subscribe(event => {
      if (event.type === 'VERSION_READY' && confirm('A new update is available. Do you want to install now?')) {
        globalThis.location?.reload();
      }
    });
  }
}
