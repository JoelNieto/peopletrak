import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  model,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { addDays, format, startOfMonth } from 'date-fns';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { SupabaseService } from '../services/supabase.service';
import { DashboardStore } from './dashboard.store';

@Component({
    selector: 'app-timelogs',
    imports: [
        CardModule,
        DropdownModule,
        CalendarModule,
        FormsModule,
        DatePipe,
        TableModule,
    ],
    template: `<p-card
    header="Marcaciones"
    subheader="Listado de marcaciones de empleados"
  >
    <div class="flex gap-3">
      <div class="input-container">
        <p-dropdown
          [options]="store.branches()"
          optionLabel="name"
          optionValue="id"
          placeholder="Seleccione una sucursal"
          filter
          appendTo="body"
          [(ngModel)]="branchId"
        />
      </div>
      <div class="input-container">
        <p-dropdown
          [options]="employees()"
          optionLabel="short_name"
          optionValue="id"
          placeholder="Seleccione un empleado"
          filter
          appendTo="body"
          [(ngModel)]="employeeId"
        />
      </div>
      <div class="input-container">
        <p-calendar
          placeholder="Fecha"
          selectionMode="range"
          appendTo="body"
          [(ngModel)]="dateRange"
        />
      </div>
    </div>
    <p-table [value]="dayLogs()" [rows]="10">
      <ng-template pTemplate="header">
        <tr>
          <th>Día</th>
          <th>Entrada</th>
          <th>Inicio de almuerzo</th>
          <th>Fin de almuerzo</th>
          <th>Salida</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-log>
        <tr>
          <td>{{ log.day | date : 'mediumDate' }}</td>
          <td>{{ log.entry | date : 'hh:mm a' }}</td>
          <td>{{ log.lunch_start | date : 'hh:mm a' }}</td>
          <td>{{ log.lunch_end | date : 'hh:mm a' }}</td>
          <td>{{ log.exit | date : 'hh:mm a' }}</td>
        </tr>
      </ng-template>
    </p-table>
  </p-card>`,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelogsComponent implements OnInit {
  public store = inject(DashboardStore);
  public dateRange = model<Date[]>([startOfMonth(new Date()), new Date()]);
  public employeeId = model<string>();
  public branchId = model<string>();
  private injector = inject(Injector);
  private supabase = inject(SupabaseService);
  public employees = computed(() =>
    this.store.employeesList().filter((x) => x.branch_id === this.branchId())
  );

  public logs = signal<any[]>([]);

  public dayLogs = computed(() =>
    this.logs()
      .map((x) => ({ ...x, day: format(x.created_at, 'yyyy-MM-dd') }))
      .reduce<
        {
          day: string;
          entry?: Date;
          lunch_start?: Date;
          lunch_end?: Date;
          exit?: Date;
        }[]
      >((acc, x) => {
        const index = acc.findIndex((y) => y.day === x.day);
        if (index === -1) {
          acc.push({ day: x.day, [x.type]: x.created_at });
          return acc;
        }
        acc[index] = { ...acc[index], [x.type]: x.created_at };
        return acc;
      }, [])
  );

  public ngOnInit(): void {
    effect(
      async () => {
        const start = this.dateRange()?.[0];
        const end = this.dateRange()?.[1];
        if (this.employeeId() && start && end) {
          const { data, error } = await this.supabase.client
            .from('timelogs')
            .select()
            .eq('employee_id', this.employeeId())
            .gte('created_at', format(start, 'yyyy-MM-dd'))
            .lte('created_at', format(addDays(end, 1), 'yyyy-MM-dd'));
          if (error) {
            console.error(error);
            return;
          }

          this.logs.set(data);
        }
      },
      { injector: this.injector }
    );
  }
}
