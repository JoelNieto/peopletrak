import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DashboardStore } from './dashboard.store';

@Component({
  selector: 'app-time-offs',
  standalone: true,
  imports: [ReactiveFormsModule, DropdownModule, CalendarModule],
  template: `<form [formGroup]="form">
    <div class="flex flex-col md:grid grid-cols-2 gap-4">
      <div class="input-container">
        <label for="employee_id">Empleado</label>
        <p-dropdown
          formControlName="employee_id"
          inputId="employee"
          [options]="store.employeesList()"
          optionValue="id"
          appendTo="body"
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
    </div>
  </form>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeOffsComponent {
  public store = inject(DashboardStore);
  protected form = new FormGroup({
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
}
