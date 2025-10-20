import {
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { ToastModule } from '@mean-stream/ngbx';

import { CookieBannerComponent } from './core/cookie-banner/cookie-banner.component';
import { BASE_URL } from './core/injection-tokens/base-url';
import { NavbarComponent } from './core/navbar/navbar.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    NavbarComponent,
    RouterOutlet,
    CookieBannerComponent,
    ToastModule,
  ],
})
export class AppComponent implements OnInit {
  private swUpdate = inject(SwUpdate);
  private meta = inject(Meta);
  private baseUrl? = inject(BASE_URL, { optional: true });
  title = 'apollusia';

  ngOnInit(): void {
    this.baseUrl && this.meta.updateTag({property: 'og:image', content: `${this.baseUrl}/assets/logo.png`});

    this.swUpdate.versionUpdates.subscribe(event => {
      if (event.type === 'VERSION_READY' && confirm('A new update is available. Do you want to install now?')) {
        globalThis.location?.reload();
      }
    });
  }
}
