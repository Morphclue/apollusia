import {Routes} from '@angular/router';

import {LegalComponent} from './legal/legal.component';

export const routes: Routes = [
  {path: '', component: LegalComponent, title: $localize`:@@legal-page-title:Legal | Apollusia`},
  {path: '**', pathMatch: 'full', redirectTo: ''}
];
