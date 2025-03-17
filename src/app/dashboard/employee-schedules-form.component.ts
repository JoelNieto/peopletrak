import { NgClass } from '@angular/common';
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
import { toDate } from 'date-fns-tz';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select';
import { v4 } from 'uuid';
import { colorVariants } from '../models';
import { TrimPipe } from '../pipes/trim.pipe';
import { SupabaseService } from '../services/supabase.service';
import { DashboardStore } from '../stores/dashboard.store';

@Component({
  selector: 'pt-employee-schedules-form',
  imports: [
    SelectModule,
    Button,
    DatePicker,
    FormsModule,
    ReactiveFormsModule,
    TrimPipe,
    NgClass,
  ],
  template: `<form [formGroup]="form" (ngSubmit)="saveChanges()">
    <div class="grid grid-cols-2 gap-4">
      <div class="input-container">
        <label for="employee_id">Empleado</label>
        <p-select
          formControlName="employee_id"
          [options]="store.employees()"
          optionValue="id"
          placeholder="Seleccionar empleado"
          filter
          filterBy="first_name,father_name"
          appendTo="body"
        >
          <ng-template #selectedItem let-selected>
            {{ selected.father_name | trim }}, {{ selected.first_name | trim }}
          </ng-template>
          <ng-template let-item #item>
            {{ item.father_name | trim }}, {{ item.first_name | trim }}
          </ng-template>
        </p-select>
      </div>
      <div class="input-container">
        <label for="schedule_id">Turno</label>
        <p-select
          [options]="store.schedules()"
          optionLabel="name"
          optionValue="id"
          formControlName="schedule_id"
          appendTo="body"
          placeholder="Seleccionar turno"
        >
          <ng-template #item let-item>
            <div class="flex items-center ">
              <div
                class="px-3 py-1.5 text-sm rounded"
                [ngClass]="colorVariants[item.color]"
              >
                {{ item.name }}
              </div>
            </div>
          </ng-template>
          <ng-template #selectedItem let-selected>
            <div class="flex items-center ">
              <div
                class="text-sm rounded"
                [ngClass]="colorVariants[selected.color]"
              >
                {{ selected.name }}
              </div>
            </div>
          </ng-template>
        </p-select>
      </div>
      <div class="input-container">
        <label for="start_date">Fecha inicio</label>
        <p-datepicker formControlName="start_date" appendTo="body" />
      </div>
      <div class="input-container">
        <label for="end_date">Fecha fin</label>
        <p-datepicker formControlName="end_date" appendTo="body" />
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  public colorVariants = colorVariants;

  ngOnInit(): void {
    const { employee_schedule, employee_id } = this.dialog.data;
    if (employee_id) {
      this.form.patchValue({ employee_id });
      this.form.get('employee_id')?.disable();
      return;
    }
    if (employee_schedule) {
      const { id, employee_id, schedule_id, start_date, end_date } =
        employee_schedule;
      this.form.patchValue({
        id,
        employee_id,
        schedule_id,
      });
      this.form
        .get('start_date')
        ?.patchValue(toDate(start_date, { timeZone: 'America/Panama' }));
      this.form
        .get('end_date')
        ?.patchValue(toDate(end_date, { timeZone: 'America/Panama' }));
    }
  }

  async saveChanges(): Promise<void> {
    this.loading.set(true);
    try {
      const { error } = await this.supabase.client
        .from('employee_schedules')
        .upsert(this.form.getRawValue());
      if (error) throw error;
      this.message.add({
        severity: 'success',
        summary: 'Cambios guardados',
        detail: 'Los cambios se guardaron correctamente.',
      });

      this.dialogRef.close();
    } catch (error) {
      console.error(error);
      this.loading.set(false);
      this.message.add({
        severity: 'error',
        summary: 'Error al guardar',
        detail: 'Ocurrió un error al guardar los cambios.',
      });
      return;
    } finally {
      this.loading.set(false);
    }
  }
}
