import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard.component').then((x) => x.DashboardComponent),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./home.component').then((x) => x.HomeComponent),
      },
      {
        path: 'employees',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./employee-list.component').then(
                (x) => x.EmployeeListComponent
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./employee-form.component').then(
                (x) => x.EmployeeFormComponent
              ),
          },
          {
            path: ':employee_id',
            loadComponent: () =>
              import('./employee-detail.component').then(
                (x) => x.EmployeeDetailComponent
              ),
          },

          {
            path: ':employee_id/edit',
            loadComponent: () =>
              import('./employee-form.component').then(
                (x) => x.EmployeeFormComponent
              ),
          },
        ],
      },
      {
        path: 'timelogs',
        loadComponent: () =>
          import('./timelogs.component').then((x) => x.TimelogsComponent),
      },
      {
        path: 'companies',
        loadComponent: () =>
          import('./companies.component').then((x) => x.CompaniesComponent),
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('./departments.component').then((x) => x.DepartmentsComponent),
      },
      {
        path: 'positions',
        loadComponent: () =>
          import('./positions.component').then((x) => x.PositionsComponent),
      },
      {
        path: 'schedules',
        loadComponent: () =>
          import('./schedules.component').then((x) => x.SchedulesComponent),
      },
      {
        path: 'branches',
        loadComponent: () =>
          import('./branches.component').then((x) => x.BranchesComponent),
      },
      {
        path: 'shifts',
        loadComponent: () =>
          import('./shifts.component').then((x) => x.ShiftsComponent),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];
