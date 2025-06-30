import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  addDays,
  differenceInMinutes,
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSunday,
} from 'date-fns';
import { toDate } from 'date-fns-tz';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import {
  AttendanceSheet,
  EmployeeSchedule,
  PayrollEmployee,
  PayrollPayment,
  Schedule,
  TimeLog,
  TimeLogEnum,
} from '../models';

@Component({
  selector: 'pt-payroll-payments-details',
  imports: [
    Button,
    Select,
    FormsModule,
    TableModule,
    DatePipe,
    DecimalPipe,
    CurrencyPipe,
    Card,
  ],
  template: `<div class="flex flex-col gap-4">
    <h1 class="text-2xl font-bold text-gray-700 dark:text-gray-200">
      Planilla: {{ payment.value()?.[0]?.payroll?.name }}
    </h1>
    <div class="flex gap-2 items-center">
      <p-select
        id="employee"
        fluid
        [(ngModel)]="currentEmployee"
        (ngModelChange)="generateAttendanceSheet()"
        [options]="employees.value() ?? []"
        optionLabel="employee.first_name"
        optionValue="employee.id"
        placeholder="---Seleccione un empleado---"
        filter
        filterBy="employee.first_name, employee.father_name"
      >
        <ng-template #selectedItem let-selected>
          {{ selected.employee.first_name }}
          {{ selected.employee.father_name }}
        </ng-template>
        <ng-template #item let-item>
          {{ item.employee.first_name }} {{ item.employee.father_name }}
        </ng-template>
      </p-select>
      <p-button label="Generar" (click)="generateAttendanceSheet()" />
    </div>
    @if (currentAttendanceSheets().length > 0) {
    <p-card>
      <ng-template #title>Consolidado</ng-template>
      <div class="flex gap-4">
        <div class="flex flex-col gap-2 w-full">
          <div
            class="uppercase font-bold bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 p-2 rounded text-sm"
          >
            Ingresos
          </div>
          <div class="flex justify-between items-center gap-2 text-sm">
            <div class="text-gray-800 dark:text-gray-200">Salario base</div>
            <div>{{ summary().worked_hours_payment | currency : '$' }}</div>
          </div>
          <div class="flex justify-between items-center gap-2 text-sm">
            <div class="text-gray-800 dark:text-gray-200">Recargo domingo</div>
            <div>{{ summary().sunday_payment | currency : '$' }}</div>
          </div>
          <div class="flex justify-between items-center gap-2 text-sm">
            <div class="text-gray-800 dark:text-gray-200">Tardanzas</div>
            <div>{{ summary().late_hours_payment | currency : '$' }}</div>
          </div>
        </div>
        <div class="flex flex-col gap-2 w-full">
          <div
            class="uppercase font-bold bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 p-2 rounded text-sm"
          >
            Deducciones
          </div>
          <div class="flex justify-between items-center gap-2 text-sm">
            <div class="text-gray-800 dark:text-gray-200">Salario base</div>
            <div>{{ summary().worked_hours_payment | currency : '$' }}</div>
          </div>
          <div class="flex justify-between items-center gap-2 text-sm">
            <div class="text-gray-800 dark:text-gray-200">Tardanzas</div>
            <div>{{ summary().late_hours_payment | currency : '$' }}</div>
          </div>
        </div>
      </div>
    </p-card>
    }
    <div>
      <p-table
        [value]="currentAttendanceSheets()"
        [responsiveLayout]="'scroll'"
        stripedRows
        showGridlines
        scrollable
        dataKey="date"
      >
        <ng-template pTemplate="header">
          <tr>
            <th pFrozenColumn>Fecha</th>
            <th>Turno</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Hrs. Trabajadas</th>
            <th>Salario base</th>
            <th>Recargo domingo</th>
            <th>Hrs. Extras</th>
            <th>Hrs. Tardías</th>
            <th>Hrs. Tardías Desc.</th>
            <th></th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-attendanceSheet>
          <tr>
            <td pFrozenColumn>{{ attendanceSheet.date | date }}</td>
            <td>{{ attendanceSheet.schedule?.name }}</td>
            <td>{{ attendanceSheet.entry_time | date : 'hh:mm a' }}</td>
            <td>{{ attendanceSheet.exit_time | date : 'hh:mm a' }}</td>
            <td>{{ attendanceSheet.worked_hours | number : '1.0-2' }}</td>
            <td>
              {{ attendanceSheet.worked_hours_payment | currency : '$' }}
            </td>
            <td>{{ attendanceSheet.sunday_payment | currency : '$' }}</td>
            <td>{{ attendanceSheet.overtime_hours | number : '1.0-2' }}</td>
            <td>{{ attendanceSheet.late_hours | number : '1.0-2' }}</td>
            <td>
              <span
                [class.text-red-500]="attendanceSheet.late_hours_payment > 0"
                >{{ attendanceSheet.late_hours_payment | currency : '$' }}</span
              >
            </td>
            <td>
              <p-select
                [options]="absenceCauses"
                optionLabel="label"
                optionValue="value"
              />
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  </div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayrollPaymentsDetailsComponent {
  public payment_id = input.required<string>();
  public currentEmployee = model<string>();
  public absenceCauses = [
    { value: 'PERSONAL', label: 'Personal' },
    { value: 'INJUSTIFICADA', label: 'Injustificada' },
    { value: 'JUSTIFICADA', label: 'Justificada' },
  ];
  selectedSheets!: AttendanceSheet[];
  private http = inject(HttpClient);
  public payment = httpResource<PayrollPayment[]>(() => ({
    url: `${process.env['ENV_SUPABASE_URL']}/rest/v1/payroll_payments`,
    method: 'GET',
    params: {
      select: '*, payroll:payrolls(*)',
      id: `eq.${this.payment_id()}`,
    },
  }));

  public employees = httpResource<PayrollEmployee[]>(() => {
    if (!this.payment.value()?.[0]) {
      return undefined;
    }
    return {
      url: `${process.env['ENV_SUPABASE_URL']}/rest/v1/employee_payrolls`,
      method: 'GET',
      params: {
        select:
          '*, employee:employees(id, first_name, father_name, monthly_salary, hourly_salary)',
        payroll_id: `eq.${this.payment.value()?.[0]?.payroll_id}`,
      },
    };
  });

  selectedEmployee = computed(() => {
    return this.employees
      .value()
      ?.find((employee) => employee.employee.id === this.currentEmployee());
  });

  /*  public currentAttendanceSheet = httpResource<AttendanceSheet[]>(() => {
    if (!this.selectedEmployee()) {
      return undefined;
    }
    return {
      url: `${
        process.env['ENV_SUPABASE_URL']
      }/rest/v1/attendance_sheets?date=gte.${format(
        this.payment.value()![0].start_date,
        'yyyy-MM-dd'
      )}&date=lte.${format(
        this.payment.value()![0].end_date,
        'yyyy-MM-dd'
      )}&employee_id=eq.${this.currentEmployee()}`,
      method: 'GET',
      params: {
        select:
          '*, employee:employees(id, first_name, father_name), branch:branches(*), schedule:schedules(*)',
      },
    };
  }); */

  public attendanceSheet = signal<Record<string, AttendanceSheet>>({});

  public timeLogs = httpResource<TimeLog[]>(() => {
    if (!this.payment.value()?.[0]) {
      return undefined;
    }
    return {
      url: `${
        process.env['ENV_SUPABASE_URL']
      }/rest/v1/timelogs?created_at=lte.${format(
        addDays(this.payment.value()![0].end_date, 1),
        'yyyy-MM-dd 23:59:59'
      )}`,
      method: 'GET',
      params: {
        select:
          '*, employee:employees(id, first_name, father_name), branch:branches(id, name)',
        created_at: `gte.${format(
          addDays(this.payment.value()![0].start_date, 1),
          'yyyy-MM-dd 06:00:00'
        )}`,
      },
    };
  });

  public schedules = httpResource<EmployeeSchedule[]>(() => {
    if (!this.payment.value()?.[0]) {
      return undefined;
    }
    return {
      url: `${process.env['ENV_SUPABASE_URL']}/rest/v1/employee_schedules`,
      method: 'GET',
      params: {
        select: '*,schedule:schedules(*)',
        start_date: `gte.${format(
          this.payment.value()![0].start_date,
          'yyyy-MM-dd 06:00:00'
        )}`,
        end_date: `lte.${format(
          addDays(this.payment.value()![0].end_date, 1),
          'yyyy-MM-dd 23:59:59'
        )}`,
      },
    };
  });
  public currentAttendanceSheets = computed(() =>
    Object.values(this.attendanceSheet()).map(
      (attendanceSheet) => attendanceSheet
    )
  );

  public summary = computed(() =>
    this.currentAttendanceSheets().reduce(
      (acc, attendanceSheet) => {
        return {
          worked_hours_payment:
            acc.worked_hours_payment + attendanceSheet.worked_hours_payment,
          late_hours_payment:
            acc.late_hours_payment + attendanceSheet.late_hours_payment,
          sunday_payment: acc.sunday_payment + attendanceSheet.sunday_payment,
          worked_hours: acc.worked_hours + attendanceSheet.worked_hours,
          late_hours: acc.late_hours + attendanceSheet.late_hours,
        };
      },
      {
        sunday_payment: 0,
        worked_hours_payment: 0,
        late_hours_payment: 0,
        worked_hours: 0,
        late_hours: 0,
      }
    )
  );

  generateAttendanceSheet() {
    const schedules = this.schedules.value() ?? [];
    const timeLogs = this.timeLogs.value() ?? [];
    const days = eachDayOfInterval({
      start: toDate(this.payment.value()![0].start_date, {
        timeZone: 'America/Panama',
      }),
      end: toDate(this.payment.value()![0].end_date, {
        timeZone: 'America/Panama',
      }),
    }).map((day) => format(day, 'yyyy-MM-dd'));
    const employeeTimelog: Record<string, AttendanceSheet> = {};

    if (!this.selectedEmployee()?.employee?.id) return;
    for (const day of days) {
      const employeeTimeLogs = timeLogs.filter(
        (timeLog) =>
          timeLog.employee_id === this.selectedEmployee()?.employee?.id &&
          isSameDay(
            timeLog.created_at,
            toDate(day, { timeZone: 'America/Panama' })
          )
      );

      const entryTime = employeeTimeLogs.find(
        (timeLog) => timeLog.type === TimeLogEnum.entry
      )?.created_at;

      const exitTime = employeeTimeLogs.find(
        (timeLog) => timeLog.type === TimeLogEnum.exit
      )?.created_at;
      const lunchStartTime = employeeTimeLogs.find(
        (timeLog) => timeLog.type === TimeLogEnum.lunch_start
      )?.created_at;
      const lunchEndTime = employeeTimeLogs.find(
        (timeLog) => timeLog.type === TimeLogEnum.lunch_end
      )?.created_at;
      const schedule = schedules.find(
        (schedule) =>
          schedule.employee_id === this.selectedEmployee()?.employee?.id &&
          (isBefore(
            toDate(schedule.start_date, { timeZone: 'America/Panama' }),
            toDate(day, { timeZone: 'America/Panama' })
          ) ||
            isSameDay(
              toDate(schedule.start_date, { timeZone: 'America/Panama' }),
              toDate(day, { timeZone: 'America/Panama' })
            )) &&
          (isAfter(
            toDate(schedule.end_date, { timeZone: 'America/Panama' }),
            toDate(day, { timeZone: 'America/Panama' })
          ) ||
            isSameDay(
              toDate(schedule.end_date, { timeZone: 'America/Panama' }),
              toDate(day, { timeZone: 'America/Panama' })
            ))
      )?.schedule;
      const { worked_hours, overtime_hours } = this.getHours({
        entryTime: entryTime!,
        exitTime: exitTime!,
        lunchStartTime: lunchStartTime,
        lunchEndTime: lunchEndTime,
      });
      const late_hours = this.getLateHours({
        entryTime: entryTime!,
        schedule: schedule!,
      });
      const is_sunday = isSunday(toDate(day, { timeZone: 'America/Panama' }));
      const hourly_salary = this.selectedEmployee()!.hourly_salary!;
      const worked_hours_payment =
        schedule?.day_off || worked_hours === 0 ? 0 : 8 * hourly_salary;
      const late_hours_payment = late_hours * hourly_salary;
      const sunday_payment = is_sunday ? 8 * hourly_salary * 0.5 : 0;
      const absence_hours = 0;
      const absence_hours_payment = 0;

      employeeTimelog[day] = {
        employee_id: this.selectedEmployee()!.employee!.id,
        branch_id:
          employeeTimeLogs.find((timeLog) => timeLog.type === TimeLogEnum.entry)
            ?.branch_id ?? null,
        branch: employeeTimeLogs.find(
          (timeLog) => timeLog.type === TimeLogEnum.entry
        )?.branch,
        schedule_id: schedule?.id ?? null,
        schedule: schedule,
        date: day,
        entry_time: entryTime ?? null,
        exit_time: exitTime ?? null,
        lunch_start_time: lunchStartTime ?? null,
        lunch_end_time: lunchEndTime ?? null,
        is_sunday,
        is_holiday: false,
        worked_hours_payment,
        late_hours_payment,
        sunday_payment,
        holiday_payment: 0,
        absence_hours,
        absence_hours_payment,
        is_late: schedule?.day_off
          ? false
          : entryTime &&
            schedule?.entry_time &&
            this.calcTimeDiff(
              format(entryTime, 'hh:mm:ss'),
              schedule.entry_time as string
            ) > schedule.minutes_tolerance
          ? true
          : false,
        worked_hours,
        late_hours,
        overtime_hours,
      };
    }
    this.attendanceSheet.set(employeeTimelog);

    /*  this.http
      .post(
        `${process.env['ENV_SUPABASE_URL']}/rest/v1/attendance_sheets`,
        attendanceSheets
      )
      .subscribe(); */
  }

  calcTimeDiff = (time1: string, time2: string) => {
    const timeStart = new Date();
    const timeEnd = new Date();
    const valueStart = time1.split(':');
    const valueEnd = time2.split(':');

    timeStart.setHours(+valueStart[0], +valueStart[1], 0, 0);
    timeEnd.setHours(+valueEnd[0], +valueEnd[1], 0, 0);

    return differenceInMinutes(timeStart, timeEnd);
  };

  getHours({
    entryTime,
    exitTime,
    lunchStartTime,
    lunchEndTime,
  }: {
    entryTime: Date;
    exitTime: Date;
    lunchStartTime: Date | undefined;
    lunchEndTime: Date | undefined;
  }) {
    const totalMinutes = differenceInMinutes(exitTime, entryTime);
    if (!lunchStartTime || !lunchEndTime) {
      return {
        worked_hours: totalMinutes ? Math.floor(totalMinutes / 60) : 0,
        overtime_hours: 0,
      };
    }
    if (!totalMinutes) {
      return {
        worked_hours: 0,
        overtime_hours: 0,
      };
    }
    const lunchMinutes = differenceInMinutes(lunchEndTime, lunchStartTime);
    const workedMinutes = totalMinutes - lunchMinutes;
    const hours = Math.floor(workedMinutes / 60);
    if (hours > 8) {
      const overtimeMinutes = workedMinutes - 8 * 60;
      const overtimeHours = Math.floor(overtimeMinutes / 60);
      const overtimeMinutesLeft = overtimeMinutes % 60;
      const overtimeTotalHours = overtimeHours + overtimeMinutesLeft / 60;
      return {
        worked_hours: 8,
        overtime_hours: overtimeTotalHours,
      };
    }

    const minutes = workedMinutes % 60;
    const totalHours = hours + minutes / 60;
    return {
      worked_hours: totalHours,
      overtime_hours: 0,
    };
  }

  getLateHours({
    entryTime,
    schedule,
  }: {
    entryTime: Date;
    schedule: Schedule;
  }) {
    if (!schedule || !entryTime) {
      return 0;
    }
    const totalMinutes = this.calcTimeDiff(
      format(entryTime, 'hh:mm:ss'),
      schedule.entry_time as string
    );
    if (totalMinutes < schedule.minutes_tolerance) {
      return 0;
    }
    const lateHours = totalMinutes / 60;
    return lateHours;
  }
}
