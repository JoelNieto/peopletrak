import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DashboardStore } from './dashboard.store';

@Component({
  selector: 'app-dashboard',
  template: `
    <mat-toolbar class="sticky top-0 z-10">
      <a routerLink="/home">Registro de empleados</a>
      <span class="example-spacer"></span>
      <a mat-button routerLink="/employees" routerLinkActive="active">
        Empleados
      </a>
      <a mat-button routerLink="/branches" routerLinkActive="active">
        Sucursales
      </a>
      <a mat-button routerLink="/departments" routerLinkActive="active">
        Areas </a
      ><a mat-button routerLink="/positions" routerLinkActive="active">
        Cargos
      </a>
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

      .active {
        background-color: var(--mdc-filled-text-field-container-color)
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
    RouterLinkActive,
  ],
})
export class DashboardComponent {}
