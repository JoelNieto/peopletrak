import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CardModule } from 'primeng/card';

import { DatePipe } from '@angular/common';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DashboardStore } from './dashboard.store';

@Component({
    selector: 'app-home',
    imports: [BaseChartDirective, CardModule, DatePipe],
    template: ` <div class="md:px-8">
    <h1 class="text-gray-100 font-bold text-2xl">Dashboard</h1>
    <div class="flex flex-col md:grid md:grid-cols-4 gap-4">
      <p-card
        header="Por sucursal"
        subheader="Listado de empleados por sucursal"
        class="md:col-span-2"
      >
        <div>
          <canvas
            baseChart
            #genderChart
            [datasets]="branchData()"
            [labels]="branchLabels()"
            type="bar"
            [options]="pieChartOptions"
            height="200"
          ></canvas>
        </div>
      </p-card>
      <div class="md:col-span-2 grid grid-cols-2 gap-3">
        <p-card header="HeadCount">
          <div class="flex items-center justify-center">
            <p class="mat-display-large">{{ state.headCount() }}</p>
          </div>
        </p-card>
        <p-card header="Sucursales">
          <div class="flex items-center justify-center">
            <p class="mat-display-large">{{ state.branchesCount() }}</p>
          </div>
        </p-card>
        <p-card
          header="Cumpleañeros"
          class="md:col-span-2"
          [subheader]="currentMonth"
        >
          @for(item of state.birthDates(); track item) {
          <div class="flex justify-between w-full">
            <div class="flex-1 text-slate-700">
              {{ item.first_name }} {{ item.father_name }}
            </div>

            <div class="flex-1 text-slate-500 text-sm">
              {{ item.branch?.name }}
            </div>
            <div class="flex-none text-cyan-700 font-semibold px-4">
              {{ item.birth_date | date : 'd MMMM' }}
            </div>
          </div>
          }
        </p-card>
      </div>
    </div>
  </div>`,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
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

  public currentMonth = format(new Date(), 'MMMM', { locale: es });

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
