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
        path: 'timestamps',
        loadComponent: () =>
          import('./timestamps.component').then((x) => x.TimestampsComponent),
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
        path: 'branches',
        loadComponent: () =>
          import('./branches.component').then((x) => x.BranchesComponent),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];
