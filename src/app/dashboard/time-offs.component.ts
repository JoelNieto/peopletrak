import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { v4 } from 'uuid';
import { TimeOff } from '../models';
import { DashboardStore } from './dashboard.store';

@Component({
  selector: 'app-time-offs',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    CalendarModule,
    InputSwitchModule,
    InputTextareaModule,
    ButtonModule,
  ],
  template: `<form [formGroup]="form" (ngSubmit)="saveChanges()">
    <div class="flex flex-col md:grid grid-cols-2 gap-4">
      <div class="input-container">
        <label for="employee_id">Empleado</label>
        <p-dropdown
          formControlName="employee_id"
          inputId="employee"
          [options]="store.employeesList()"
          optionValue="id"
          appendTo="body"
          filterBy="first_name,father_name"
          filter
        >
          <ng-template pTemplate="selectedItem" let-selected>
            {{ selected.first_name }} {{ selected.father_name }}
          </ng-template>
          <ng-template let-item pTemplate="item">
            {{ item.first_name }} {{ item.father_name }}
          </ng-template>
        </p-dropdown>
      </div>
      <div class="input-container">
        <label for="type">Tipo</label>
        <p-dropdown
          formControlName="type_id"
          inputId="type"
          [options]="store.timeoff_types()"
          optionValue="id"
          optionLabel="name"
          appendTo="body"
        />
      </div>
      <div class="input-container">
        <label for="star_date">Duracion</label>
        <p-calendar
          formControlName="start_date"
          inputId="start_date"
          selectionMode="range"
          formControlName="dateRange"
          appendTo="body"
        />
      </div>
      <div class="flex items-center gap-2">
        <p-inputSwitch formControlName="is_approved" inputId="is_approved" />
        <label for="is_approved">Aprobado</label>
      </div>
      <div class="input-container md:col-span-2">
        <label for="notes">Comentarios</label>
        <textarea pInputTextarea formControlName="notes" rows="4"></textarea>
      </div>
    </div>
    <div class="dialog-actions">
      <p-button
        type="button"
        label="Cancelar"
        icon="pi pi-times"
        severity="secondary"
        (onClick)="dialogRef.close()"
      />
      <p-button type="submit" label="Guardar cambios" icon="pi pi-save" />
    </div>
  </form>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeOffsComponent implements OnInit {
  public store = inject(DashboardStore);
  protected form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    employee_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    type_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    dateRange: new FormControl([new Date()], {
      nonNullable: true,
      validators: [Validators.required],
    }),

    notes: new FormControl('', { nonNullable: true }),
    is_approved: new FormControl(false, { nonNullable: true }),
  });

  public dialogRef = inject(DynamicDialogRef);
  private dialog = inject(DynamicDialogConfig);

  ngOnInit() {
    const {
      data: { employee, timeoff },
    } = this.dialog;
    console.log({ employee, timeoff });
    if (employee) {
      this.form.get('employee_id')?.setValue(employee.id);
      this.form.get('employee_id')?.disable({ emitEvent: false });
    }
  }

  saveChanges() {
    const { id, employee_id, type_id, dateRange, notes, is_approved } =
      this.form.getRawValue();
    const request: TimeOff = {
      id,
      employee_id,
      type_id,
      date_from: dateRange[0],
      date_to: dateRange[1],
      notes: [notes],
      is_approved,
    };
    this.store.saveTimeOff(request);
  }
}
