import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { v4 } from 'uuid';
import { TrimPipe } from '../pipes/trim.pipe';
import { SupabaseService } from '../services/supabase.service';
import { DashboardStore } from './dashboard.store';

@Component({
    selector: 'app-employee-schedules-form',
    imports: [
        DropdownModule,
        InputTextModule,
        ButtonModule,
        CalendarModule,
        FormsModule,
        ReactiveFormsModule,
        TrimPipe,
    ],
    template: `<form [formGroup]="form">
    <div class="grid grid-cols-2 gap-4">
      <div class="input-container">
        <label for="employee_id">Empleado</label>
        <p-dropdown
          formControlName="employee_id"
          [options]="store.employees()"
          optionValue="id"
          placeholder="Seleccionar empleado"
          filter
          filterBy="first_name,father_name"
          appendTo="body"
        >
          <ng-template pTemplate="selectedItem" let-selected>
            {{ selected.father_name | trim }}, {{ selected.first_name | trim }}
          </ng-template>
          <ng-template let-item pTemplate="item">
            {{ item.father_name | trim }}, {{ item.first_name | trim }}
          </ng-template>
        </p-dropdown>
      </div>
      <div class="input-container">
        <label for="schedule_id">Turno</label>
        <p-dropdown
          [options]="store.schedules()"
          optionLabel="name"
          optionValue="id"
          formControlName="schedule_id"
          appendTo="body"
          placeholder="Seleccionar turno"
        />
      </div>
      <div class="input-container">
        <label for="start_date">Fecha inicio</label>
        <p-calendar formControlName="start_date" appendTo="body" />
      </div>
      <div class="input-container">
        <label for="end_date">Fecha fin</label>
        <p-calendar formControlName="end_date" appendTo="body" />
      </div>
    </div>
    <div class="flex justify-end gap-4 mt-4">
      <p-button
        label="Cancelar"
        severity="secondary"
        [outlined]="true"
        (onClick)="dialogRef.close()"
      />
      <p-button
        label="Guardar cambios"
        type="submit"
        [loading]="loading()"
        [disabled]="form.invalid || form.pristine"
      />
    </div>
  </form>`,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeSchedulesFormComponent implements OnInit {
  public form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    employee_id: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    schedule_id: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    start_date: new FormControl(new Date(), {
      validators: [Validators.required],
      nonNullable: true,
    }),
    end_date: new FormControl(new Date(), {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
  public store = inject(DashboardStore);
  public dialogRef = inject(DynamicDialogRef);
  private dialog = inject(DynamicDialogConfig);
  public loading = signal<boolean>(false);
  private supabase = inject(SupabaseService);
  private message = inject(MessageService);

  ngOnInit(): void {
    const { employeeSchedule, employee_id } = this.dialog.data;
    if (employee_id) {
      this.form.patchValue({ employee_id });
      this.form.get('employee_id')?.disable();
      return;
    }
    if (employeeSchedule) {
      const { id, employee_id, schedule_id, start_date, end_date } =
        employeeSchedule;
      this.form.patchValue({
        id,
        employee_id,
        schedule_id,
        start_date,
        end_date,
      });
    }
  }

  async saveChanges(): Promise<void> {
    this.loading.set(true);

    const { error } = await this.supabase.client
      .from('employee_schedules')
      .upsert(this.form.getRawValue());
    if (error) {
      console.error(error);
      this.loading.set(false);
      this.message.add({
        severity: 'error',
        summary: 'Error al guardar',
        detail: 'Ocurrió un error al guardar los cambios.',
      });
      return;
    }
    this.message.add({
      severity: 'success',
      summary: 'Cambios guardados',
      detail: 'Los cambios se guardaron correctamente.',
    });

    this.dialogRef.close();
  }
}
