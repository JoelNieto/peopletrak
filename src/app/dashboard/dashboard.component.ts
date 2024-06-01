import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DashboardStore } from './dashboard.store';

@Component({
  selector: 'app-dashboard',
  template: `
    <mat-toolbar class="sticky top-0 z-10">
      <span routerLink="/home">Registro de empleados</span>
      <span class="example-spacer"></span>
      <a mat-button routerLink="/employees"> Empleados </a>
      <a mat-button routerLink="/branches"> Sucursales </a>
      <a mat-button routerLink="/departments"> Areas </a
      ><a mat-button routerLink="/positions"> Cargos </a>
    </mat-toolbar>
    <main class="px-8 py-4">
      <router-outlet />
    </main>
  `,
  styles: `
      main {
        height: calc(100% - var(--mat-toolbar-standard-height));
      }

      .example-spacer {
        flex: 1 1 auto;
      }
    `,
  standalone: true,
  providers: [DashboardStore],
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
})
export class DashboardComponent {}
