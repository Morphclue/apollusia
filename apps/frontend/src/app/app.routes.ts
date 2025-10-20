import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.routes) },
  { path: 'poll', loadChildren: () => import('./poll/poll.routes').then(m => m.routes) },
  { path: 'about', loadChildren: () => import('./about/about.routes').then(m => m.routes) },
  { path: 'legal', loadChildren: () => import('./legal/legal.routes').then(m => m.routes) },
  { path: 'settings', loadChildren: () => import('./settings/settings.routes').then(m => m.routes) },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
];
