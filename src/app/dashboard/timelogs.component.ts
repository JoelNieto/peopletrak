import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  linkedSignal,
  model,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { addDays, format, startOfMonth } from 'date-fns';
import { trim } from 'lodash';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { utils, writeFile } from 'xlsx';
import { Branch, Employee } from '../models';
import { SupabaseService } from '../services/supabase.service';
import { DashboardStore } from './dashboard.store';
@Component({
  selector: 'app-timelogs',
  imports: [
    Button,
    CardModule,
    DropdownModule,
    CalendarModule,
    FormsModule,
    DatePipe,
    TableModule,
    TooltipModule,
    AvatarModule,
    ToastModule,
  ],
  template: `<p-card
    header="Marcaciones"
    subheader="Listado de marcaciones de empleados"
  >
    <div class="flex gap-3">
      <div class="input-container">
        <p-dropdown
          [options]="store.employeesList()"
          optionLabel="short_name"
          optionValue="id"
          placeholder="--TODOS--"
          filter
          showClear
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
      <div>
        <p-button
          icon="pi pi-file-excel"
          [loading]="loading()"
          (click)="generateReport()"
          severity="success"
          [disabled]="timelogsReport().length === 0"
        />
      </div>
    </div>
    <p-table [value]="dayLogs()" [rows]="10" paginator>
      <ng-template pTemplate="header">
        <tr>
          <th>Empleado</th>
          <th>Día</th>
          <th>Entrada</th>
          <th>Inicio de almuerzo</th>
          <th>Fin de almuerzo</th>
          <th>Salida</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-log>
        <tr>
          <td>{{ log.employee.first_name }} {{ log.employee.father_name }}</td>
          <td>{{ log.day | date : 'mediumDate' }}</td>
          <td>
            <div class="flex gap-1 items-center">
              {{ log.entry?.date | date : 'hh:mm a' }}
              @if(log.entry) {
              <p-avatar
                shape="circle"
                [label]="log.entry?.branch.short_name"
                [pTooltip]="log.entry?.branch.name"
                tooltipPosition="top"
              />}
            </div>
          </td>
          <td>
            <div class="flex gap-1 items-center">
              {{ log.lunch_start?.date | date : 'hh:mm a' }}
              @if(log.lunch_start) {
              <p-avatar
                shape="circle"
                [label]="log.lunch_start?.branch.short_name"
                [pTooltip]="log.lunch_start?.branch.name"
                tooltipPosition="top"
              />
              }
            </div>
          </td>
          <td>
            <div class="flex gap-1 items-center">
              {{ log.lunch_end?.date | date : 'hh:mm a' }}
              @if(log.lunch_end) {
              <p-avatar
                shape="circle"
                [label]="log.lunch_end?.branch.short_name"
                [pTooltip]="log.lunch_end?.branch.name"
                tooltipPosition="top"
              />}
            </div>
          </td>
          <td>
            <div class="flex gap-1 items-center">
              {{ log.exit?.date | date : 'hh:mm a' }}
              @if(log.exit) {
              <p-avatar
                shape="circle"
                [label]="log.exit?.branch.short_name"
                [pTooltip]="log.exit?.branch.name"
                tooltipPosition="top"
              />}
            </div>
          </td>
        </tr>
      </ng-template>
    </p-table>
  </p-card>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelogsComponent implements OnInit {
  public store = inject(DashboardStore);
  public dateRange = model<Date[]>([startOfMonth(new Date()), new Date()]);
  public employeeId = model<string>();
  private injector = inject(Injector);
  private supabase = inject(SupabaseService);
  public logs = signal<any[]>([]);
  public loading = signal(false);
  private message = inject(MessageService);

  private selectedEmployee = computed(() =>
    this.store.employeesList().find((x) => x.id === this.employeeId())
  );

  days = computed(() => {
    const days = [];
    for (
      let date = this.dateRange()?.[0];
      date <= this.dateRange()?.[1];
      date = addDays(date, 1)
    ) {
      days.push(format(date, 'yyyy-MM-dd'));
    }
    return days;
  });

  public dayLogs = linkedSignal(() =>
    this.logs()
      .map((x) => ({ ...x, day: format(x.created_at, 'yyyy-MM-dd') }))
      .reduce<
        {
          employee: Partial<Employee>;
          day: string;
          entry?: { date: Date; branch: Branch };
          lunch_start?: { date: Date; branch: Branch };
          lunch_end?: { date: Date; branch: Branch };
          exit?: { date: Date; branch: Branch };
        }[]
      >((acc, x) => {
        if (!acc.filter((day) => day.employee.id === x.employee.id).length) {
          this.days().forEach((day) => {
            acc.push({
              employee: x.employee,
              day,
              entry: undefined,
              lunch_start: undefined,
              lunch_end: undefined,
              exit: undefined,
            });
          });
        }

        const index = acc.findIndex(
          (y) => y.day === x.day && y.employee.id === x.employee.id
        );

        acc[index] = {
          ...acc[index],
          [x.type]: { date: x.created_at, branch: x.branch, id: x.id },
        };
        return acc;
      }, [])
      .sort((a, b) =>
        (a.employee.first_name || '').localeCompare(b.employee.first_name || '')
      )
  );

  public timelogsReport = computed(() =>
    this.dayLogs().map((x) => ({
      EMPLEADO: x.employee.first_name + ' ' + x.employee.father_name,
      DIA: x.day,
      ENTRADA: x.entry?.date ? format(x.entry?.date, 'hh:mm a') : 'SIN MARCA',
      INICIO_DESCANSO: x.lunch_start?.date
        ? format(x.lunch_start?.date, 'hh:mm a')
        : 'SIN MARCA',
      FIN_DESCANSO: x.lunch_end?.date
        ? format(x.lunch_end?.date, 'hh:mm a')
        : 'SIN MARCA',
      SALIDA: x.exit?.date ? format(x.exit?.date, 'hh:mm a') : 'SIN MARCA',
    }))
  );

  public ngOnInit(): void {
    effect(
      async () => {
        const start = this.dateRange()?.[0];
        const end = this.dateRange()?.[1];

        if (start && end) {
          const query = this.supabase.client
            .from('timelogs')
            .select(
              '*, branch:branches(*), employee:employees(id, first_name, father_name)'
            )
            .gte('created_at', format(start, 'yyyy-MM-dd 06:00:00'))
            .lte('created_at', format(addDays(end, 1), 'yyyy-MM-dd 06:00:00'));
          if (this.employeeId()) {
            query.eq('employee_id', this.employeeId());
          }
          const { data, error } = await query;
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

  generateReport() {
    try {
      this.loading.set(true);
      const ws = utils.json_to_sheet(this.timelogsReport());
      const wb = utils.book_new();

      utils.book_append_sheet(wb, ws, this.selectedEmployee()?.short_name);
      const name = this.selectedEmployee()
        ? trim(this.selectedEmployee()?.short_name.toUpperCase()).replace(
            ' ',
            '_'
          )
        : 'GLOBAL';

      writeFile(
        wb,
        `${name}_${format(this.dateRange()[0], 'yyyyMMdd')}-${format(
          this.dateRange()[1],
          'yyyyMMdd'
        )}.xlsx`
      );
    } catch (error) {
      console.error(error);
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Algo salio mal, intente nuevamente',
      });
    } finally {
      this.loading.set(false);
    }
  }
}
