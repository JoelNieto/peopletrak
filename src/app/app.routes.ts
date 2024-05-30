import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (x) => x.DashboardComponent
      ),
  },
  {
    path: 'employees',
    loadComponent: () =>
      import('./dashboard/employee-list/employee-list.component').then(
        (x) => x.EmployeeListComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((x) => x.LoginComponent),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
