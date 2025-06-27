import { DatePipe } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
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
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import {
  AttendanceSheet,
  EmployeeSchedule,
  PayrollEmployee,
  PayrollPayment,
  TimeLog,
  TimeLogEnum,
} from '../models';
import { CalculateHoursPipe } from '../pipes/calulate-hours.pipe';

@Component({
  selector: 'pt-payroll-payments-details',
  imports: [
    Button,
    Select,
    FormsModule,
    TableModule,
    DatePipe,
    CalculateHoursPipe,
  ],
  template: `<div class="flex flex-col gap-4">
    <h1>Planilla: {{ payment.value()?.[0]?.payroll?.name }}</h1>
    <p>Fecha Inicio: {{ payment.value()?.[0]?.start_date }}</p>
    <p>Fecha Fin: {{ payment.value()?.[0]?.end_date }}</p>
    <div class="input-container">
      <label for="employee">Empleado</label>
      <p-select
        id="employee"
        [(ngModel)]="currentEmployee"
        [options]="employees.value() ?? []"
        optionLabel="employee.first_name"
        optionValue="employee.id"
        filter
        filterBy="employee.first_name, employee.father_name"
      >
        <ng-template #selectedItem let-selected>
          {{ selected.employee.first_name }} {{ selected.employee.father_name }}
        </ng-template>
        <ng-template #item let-item>
          {{ item.employee.first_name }} {{ item.employee.father_name }}
        </ng-template>
      </p-select>
    </div>
    <div>
      <h2>Hoja de Asistencia</h2>
      <p-table
        [value]="currentAttendanceSheet.value() ?? []"
        [paginator]="true"
        [rows]="10"
        [rowsPerPageOptions]="[10, 20, 50]"
        [responsiveLayout]="'scroll'"
      >
        <ng-template pTemplate="header">
          <tr>
            <th>Fecha</th>
            <th>Turno</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Horas Trabajadas</th>
            <th>Horas Extras</th>
            <th>Horas de Descanso</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-attendanceSheet>
          <tr>
            <td>{{ attendanceSheet.date | date : 'shortDate' }}</td>
            <td>{{ attendanceSheet.schedule?.name }}</td>
            <td>{{ attendanceSheet.entry_time | date : 'hh:mm a' }}</td>
            <td>{{ attendanceSheet.exit_time | date : 'hh:mm a' }}</td>
            <td>{{ attendanceSheet | calculateHours : 'worked_hours' }}</td>
            <td>{{ attendanceSheet | calculateHours : 'overtime_hours' }}</td>
            <td>{{ attendanceSheet | calculateHours : 'lunch_hours' }}</td>
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

  public currentAttendanceSheet = httpResource<AttendanceSheet[]>(() => {
    if (!this.currentEmployee()) {
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
  });

  public timeLogs = httpResource<TimeLog[]>(() => {
    if (!this.payment.value()?.[0]) {
      return undefined;
    }
    return {
      url: `${
        process.env['ENV_SUPABASE_URL']
      }/rest/v1/timelogs?created_at=lte.${format(
        addDays(this.payment.value()![0].end_date, 1),
        'yyyy-MM-dd 06:00:00'
      )}`,
      method: 'GET',
      params: {
        select: '*, employee:employees(id, first_name, father_name)',
        created_at: `gte.${format(
          this.payment.value()![0].start_date,
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
          this.payment.value()![0].end_date,
          'yyyy-MM-dd 06:00:00'
        )}`,
      },
    };
  });

  generateAttendanceSheet() {
    const schedules = this.schedules.value() ?? [];
    const employees = this.employees.value() ?? [];
    const timeLogs = this.timeLogs.value() ?? [];
    const days = eachDayOfInterval({
      start: this.payment.value()![0].start_date,
      end: this.payment.value()![0].end_date,
    }).map((day) => format(day, 'yyyy-MM-dd'));
    const attendanceSheets: AttendanceSheet[] = [];
    const employeeTimelog: Record<string, Record<string, AttendanceSheet>> = {};
    for (const employee of employees) {
      if (!employee?.employee?.id) continue;
      for (const day of days) {
        const employeeTimeLogs = timeLogs.filter(
          (timeLog) =>
            timeLog.employee_id === employee?.employee?.id &&
            isSameDay(
              timeLog.created_at,
              toDate(day, { timeZone: 'America/Panama' })
            )
        );
        employeeTimelog[employee.employee.id] ??= {};
        const entryTime = employeeTimeLogs.find(
          (timeLog) => timeLog.type === TimeLogEnum.entry
        )?.created_at;

        const exitTime = employeeTimeLogs.find(
          (timeLog) => timeLog.type === TimeLogEnum.exit
        )?.created_at;
        const schedule = schedules.find(
          (schedule) =>
            schedule.employee_id === employee?.employee?.id &&
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

        employeeTimelog[employee.employee.id][day] = {
          employee_id: employee.employee.id,
          branch_id:
            employeeTimeLogs.find(
              (timeLog) => timeLog.type === TimeLogEnum.entry
            )?.branch_id ?? null,
          schedule_id: schedule?.id ?? null,
          date: day,
          entry_time: entryTime ?? null,
          exit_time: exitTime ?? null,
          lunch_start_time:
            employeeTimeLogs.find(
              (timeLog) => timeLog.type === TimeLogEnum.lunch_start
            )?.created_at ?? null,
          lunch_end_time:
            employeeTimeLogs.find(
              (timeLog) => timeLog.type === TimeLogEnum.lunch_end
            )?.created_at ?? null,
          is_sunday: isSunday(toDate(day, { timeZone: 'America/Panama' })),
          is_holiday: false,
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
          worked_hours: 0,
          late_hours: 0,
        };
      }
    }
    Object.entries(employeeTimelog).forEach(([_, days]) => {
      attendanceSheets.push(...Object.values(days));
    });

    console.log(attendanceSheets);

    this.http
      .post(
        `${process.env['ENV_SUPABASE_URL']}/rest/v1/attendance_sheets`,
        attendanceSheets
      )
      .subscribe();
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
}
