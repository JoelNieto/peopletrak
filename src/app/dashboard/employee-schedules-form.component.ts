import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { DashboardStore } from './dashboard.store';

@Component({
  selector: 'app-employee-schedules-form',
  standalone: true,
  imports: [
    DropdownModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  template: `<form [formGroup]="form">
    <div class="grid grid-cols-2 gap-4">
      <div class="input-container">
        <label for="employee_id">Empleado</label>
        <p-dropdown
          formControlName="employee_id"
          [options]="store.employees()"
          placeholder="Seleccionar empleado"
          filter
          filterBy="first_name,father_name"
          appendTo="body"
        >
          <ng-template pTemplate="selectedItem" let-selected>
            {{ selected.father_name }}, {{ selected.first_name }}
          </ng-template>
          <ng-template let-item pTemplate="item">
            {{ item.father_name }}, {{ item.first_name }}
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
        [loading]="store.loading()"
        [disabled]="form.invalid || form.pristine"
      />
    </div>
  </form>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeSchedulesFormComponent {
  public form = new FormGroup({
    employee_id: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    schedule_id: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    start_date: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    end_date: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
  public store = inject(DashboardStore);
  public dialogRef = inject(DynamicDialogRef);
}
