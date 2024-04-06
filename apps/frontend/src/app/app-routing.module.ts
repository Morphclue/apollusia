import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(p => p.DashboardModule)},
  {path: 'poll', loadChildren: () => import('./poll/poll.module').then(p => p.PollModule)},
  {path: 'about', loadChildren: () => import('./about/about.module').then(p => p.AboutModule)},
  {path: 'legal', loadChildren: () => import('./legal/legal.module').then(p => p.LegalModule)},
  {path: 'settings', loadChildren: () => import('./settings/settings.module').then(p => p.SettingsModule)},
  {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking',
    paramsInheritanceStrategy: 'always',
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
