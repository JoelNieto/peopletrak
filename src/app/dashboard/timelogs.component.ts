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
import { AvatarModule } from 'primeng/avatar';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { utils, writeFile } from 'xlsx';
import { Branch } from '../models';
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
    TooltipModule,
    AvatarModule,
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
      <div>
        <p-button
          icon="pi pi-file-excel"
          (click)="generateReport()"
          severity="success"
          [disabled]="timelogsReport().length === 0"
        />
      </div>
    </div>
    <p-table [value]="dayLogs()" [rows]="10" paginator>
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

  private selectedEmployee = computed(() =>
    this.store.employeesList().find((x) => x.id === this.employeeId())
  );

  public dayLogs = linkedSignal(() =>
    this.logs()
      .map((x) => ({ ...x, day: format(x.created_at, 'yyyy-MM-dd') }))
      .reduce<
        {
          day: string;
          entry?: { date: Date; branch: Branch; id: string };
          lunch_start?: { date: Date; branch: Branch };
          lunch_end?: { date: Date; branch: Branch };
          exit?: { date: Date; branch: Branch };
        }[]
      >((acc, x) => {
        const index = acc.findIndex((y) => y.day === x.day);
        if (index === -1) {
          acc.push({
            day: x.day,
            [x.type]: { date: x.created_at, branch: x.branch, id: x.id },
          });
          return acc;
        }
        acc[index] = {
          ...acc[index],
          [x.type]: { date: x.created_at, branch: x.branch, id: x.id },
        };
        return acc;
      }, [])
  );

  public timelogsReport = computed(() =>
    this.dayLogs().map((x) => ({
      EMPLEADO: this.selectedEmployee()?.full_name,
      DIA: x.day,
      ENTRADA: x.entry?.date ? format(x.entry?.date, 'hh:mm a') : '',
      INICIO_DESCANSO: x.lunch_start?.date
        ? format(x.lunch_start?.date, 'hh:mm a')
        : '',
      FIN_DESCANSO: x.lunch_end?.date
        ? format(x.lunch_end?.date, 'hh:mm a')
        : '',
      SALIDA: x.exit?.date ? format(x.exit?.date, 'hh:mm a') : '',
    }))
  );

  public ngOnInit(): void {
    effect(
      async () => {
        const start = this.dateRange()?.[0];
        const end = this.dateRange()?.[1];
        if (this.employeeId() && start && end) {
          const { data, error } = await this.supabase.client
            .from('timelogs')
            .select('*, branch:branches(*)')
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

  generateReport() {
    const ws = utils.json_to_sheet(this.timelogsReport());
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, this.selectedEmployee()?.full_name);
    writeFile(
      wb,
      `${trim(this.selectedEmployee()?.short_name.toUpperCase()).replace(
        ' ',
        '_'
      )}_${format(this.dateRange()[0], 'yyyyMMdd')}-${format(
        this.dateRange()[1],
        'yyyyMMdd'
      )}.xlsx`
    );
  }
}
