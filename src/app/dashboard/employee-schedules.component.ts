import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { EmployeeSchedule } from '../models';
import { SupabaseService } from '../services/supabase.service';
import { EmployeeSchedulesFormComponent } from './employee-schedules-form.component';

@Component({
    selector: 'app-employee-schedules',
    imports: [TableModule, ButtonModule],
    providers: [DynamicDialogRef, DialogService],
    template: `<div class="flex justify-end">
      <p-button
        label="Agregar"
        icon="pi pi-plus-circle"
        (click)="editSchedule(employeeId())"
      />
    </div>
    <p-table [value]="employeeSchedules()">
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="name">Turno<p-sortIcon field="name" /></th>
          <th pSortableColumn="start_date">
            Inicio<p-sortIcon field="start_date" />
          </th>
          <th pSortableColumn="end_date">
            Inicio<p-sortIcon field="end_date" />
          </th>
          <th></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-schedule>
        <tr>
          <td>{{ schedule.schedule.name }}</td>
          <td>{{ schedule.schedule.start_date }}</td>
          <td>{{ schedule.schedule.end_date }}</td>
          <td>
            <p-button
              icon="pi pi-pencil"
              (click)="editSchedule(schedule.employee_id)"
            />
          </td>
        </tr>
      </ng-template>
    </p-table>`,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeSchedulesComponent implements OnInit {
  public employeeId = input.required<string>();
  private supabase = inject(SupabaseService);
  private message = inject(MessageService);
  public employeeSchedules = signal<EmployeeSchedule[]>([]);
  private dialogRef = inject(DynamicDialogRef);
  private dialog = inject(DialogService);

  async ngOnInit(): Promise<void> {
    const { data, error } = await this.supabase.client
      .from('employee_schedules')
      .select('*, schedule:schedules(*)')
      .eq('employee_id', this.employeeId());
    if (error) {
      console.error(error);
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Ha ocurrido un error al cargar los horarios del empleado',
      });
      return;
    }

    this.employeeSchedules.set(data);
  }

  public editSchedule(employee_id?: string): void {
    this.dialogRef = this.dialog.open(EmployeeSchedulesFormComponent, {
      header: 'Editar horario',
      data: { employee_id },
    });
  }
}
