import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
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
    BaseChartDirective,
  ],
  template: ` <div class="md:px-8">
    <h1 class="mat-h1">Dashboard</h1>
    <div class="flex flex-col md:grid md:grid-cols-4 gap-4">
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
      <mat-card class="md:col-span-2">
        <mat-card-header>
          <mat-card-title>Por sucursal</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <canvas
            baseChart
            #genderChart
            [datasets]="branchData()"
            [labels]="branchLabels()"
            type="bar"
            [options]="pieChartOptions"
          ></canvas>
        </mat-card-content>
      </mat-card>
    </div>
  </div>`,
  styles: `
      mat-card-header {
        @apply flex justify-between
      }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public state = inject(DashboardStore);
  public genderLabels = computed(() =>
    this.state
      .employeesByGender()
      .map((x) => (x.gender === 'F' ? 'Femenino' : 'Masculino'))
  );
  public genderDatasets = computed(() => [
    {
      data: this.state.employeesByGender().map((x) => x.count),
    },
  ]);

  public branchLabels = computed(() =>
    this.state.employeesByBranch().map((x) => x.branch?.name)
  );
  public branchData = computed(() => [
    {
      data: this.state.employeesByBranch().map((x) => x.count),
      label: 'Sucursal',
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)',
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)',
      ],
      borderWidth: 1,
    },
  ]);
  public pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    indexAxis: 'y',
  };

  public pieChartType: ChartType = 'pie';
}
