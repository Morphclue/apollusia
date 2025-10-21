import {Routes} from '@angular/router';

import {AboutComponent} from './about/about.component';

export const routes: Routes = [
  {path: '', component: AboutComponent, title: 'About | Apollusia'},
  {path: '**', pathMatch: 'full', redirectTo: ''}
];
