import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DashboardStore } from '../dashboard.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  template: ` <div class="md:p-8">
    <h1 class="mat-h1">Dashboard</h1>
    <div class="flex flex-col md:grid md:grid-cols-2 gap-4">
      <mat-card>
        <mat-card-header>
          <mat-card-title> HeadCount</mat-card-title>
          <button
            mat-icon-button
            class="more-button"
            [matMenuTriggerFor]="menu"
            aria-label="Toggle menu"
          >
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu" xPosition="before">
            <button mat-menu-item>Expand</button>
            <button mat-menu-item>Remove</button>
          </mat-menu>
        </mat-card-header>
        <mat-card-content class="flex items-center justify-center">
          <p class="mat-display-large">{{ state.headCount() }}</p>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-header>
          <mat-card-title> Sucursales</mat-card-title>
          <button
            mat-icon-button
            class="more-button"
            [matMenuTriggerFor]="menu"
            aria-label="Toggle menu"
          >
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu" xPosition="before">
            <button mat-menu-item>Expand</button>
            <button mat-menu-item>Remove</button>
          </mat-menu>
        </mat-card-header>
        <mat-card-content class="flex items-center justify-center">
          <p class="mat-display-large">{{ state.branchesCount() }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  </div>`,
  styles: `
      mat-card-header {
        @apply flex justify-between items-center
      }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public state = inject(DashboardStore);
}
