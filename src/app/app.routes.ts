import { Route } from '@angular/router';
import { authGuardFn } from '../../guard';

export const appRoutes: Route[] = [
  {
    path: '',
    canActivateChild: [authGuardFn],
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((x) => x.DASHBOARD_ROUTES),
  },
  {
    path: 'timeclock',
    title: 'Reloj de Marcación | Blackdog Panamá',
    loadComponent: () =>
      import('./timeclock.component').then((m) => m.TimeclockComponent),
  },
  {
    path: 'qr-generator',
    loadComponent: () =>
      import('./qr-generator.component').then((m) => m.QrGeneratorComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((x) => x.LoginComponent),
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
