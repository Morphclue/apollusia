import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SettingsModalComponent} from './modals';

const routes: Routes = [
  {path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(p => p.DashboardModule)},
  {path: 'poll', loadChildren: () => import('./poll/poll.module').then(p => p.PollModule)},
  {path: 'about', loadChildren: () => import('./about/about.module').then(p => p.AboutModule)},
  {path: 'legal', loadChildren: () => import('./legal/legal.module').then(p => p.LegalModule)},
  {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
  {outlet: 'modal', path: 'settings', component: SettingsModalComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
