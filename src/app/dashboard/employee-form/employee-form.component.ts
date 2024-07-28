import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toDate } from 'date-fns-tz';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { v4 } from 'uuid';

import { UniformSize } from '../../models';
import { DashboardStore } from '../dashboard.store';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="saveChanges()">
      <div class="flex flex-col md:grid grid-cols-4 md:gap-4">
        <div class="input-container">
          <label for="first_name">Nombre</label>
          <input
            type="text"
            id="first_name"
            pInputText
            formControlName="first_name"
          />
        </div>
        <div class="input-container">
          <label for="middle_name">Segundo Nombre</label>
          <input
            type="text"
            id="middle_name"
            pInputText
            formControlName="middle_name"
          />
        </div>
        <div class="input-container">
          <label for="father_name">Apellido</label>
          <input
            type="text"
            id="father_name"
            pInputText
            formControlName="father_name"
          />
        </div>
        <div class="input-container">
          <label for="mother_name">Apellido materno/casada</label>
          <input
            type="text"
            id="mother_name"
            pInputText
            formControlName="mother_name"
          />
        </div>
        <div class="input-container">
          <label for="birth_date">Fecha de nacimiento</label>
          <p-calendar
            inputId="birth_date"
            formControlName="birth_date"
            iconDisplay="input"
            [showIcon]="true"
            appendTo="body"
          />
        </div>
        <div class="input-container">
          <label for="document_id">Cedula</label>
          <input
            type="text"
            id="document_id"
            pInputText
            formControlName="document_id"
          />
        </div>
        <div class="input-container">
          <label for="address">Direccion</label>
          <input
            type="text"
            id="address"
            pInputText
            formControlName="address"
          />
        </div>
        <div class="input-container">
          <label for="email">Email</label>
          <input type="email" id="email" pInputText formControlName="email" />
        </div>
        <div class="input-container">
          <label for="phone_number">Nro. Telefono</label>
          <input
            type="text"
            id="phone_number"
            pInputText
            formControlName="phone_number"
          />
        </div>
        <div class="input-container">
          <label for="gender">Sexo</label>
          <p-dropdown
            inputId="gender"
            [options]="['F', 'M']"
            formControlName="gender"
            appendTo="body"
          />
        </div>
        <div class="input-container">
          <label for="branch">Sucursal</label>
          <p-dropdown
            [options]="state.branches()"
            optionLabel="name"
            optionValue="id"
            inputId="branch"
            formControlName="branch_id"
            appendTo="body"
          />
        </div>
        <div class="input-container">
          <label for="department">Area</label>
          <p-dropdown
            [options]="state.departments()"
            optionLabel="name"
            optionValue="id"
            inputId="department"
            formControlName="department_id"
            appendTo="body"
          />
        </div>
        <div class="input-container">
          <label for="position">Cargo</label>
          <p-dropdown
            [options]="state.positions()"
            optionLabel="name"
            optionValue="id"
            inputId="position"
            formControlName="position_id"
            appendTo="body"
          />
        </div>
        <div class="input-container">
          <label for="salary">Salario</label>
          <p-inputNumber
            mode="currency"
            currency="USD"
            locale="en-US"
            formControlName="monthly_salary"
            id="salary"
          />
        </div>
        <div class="input-container">
          <label for="size">Talla</label>
          <p-dropdown
            inputId="size"
            [options]="sizes"
            formControlName="uniform_size"
            appendTo="body"
          />
        </div>
        <div class="input-container">
          <label for="start_date">Fecha de inicio</label>
          <p-calendar
            inputId="start_date"
            formControlName="start_date"
            iconDisplay="input"
            [showIcon]="true"
            appendTo="body"
          />
        </div>
        <div class="flex col-span-4 justify-end gap-2">
          <p-button
            label="Cancelar"
            severity="secondary"
            [outlined]="true"
            (click)="dialog.close()"
          />
          <p-button
            label="Guardar cambios"
            type="submit"
            [loading]="state.loading()"
            [disabled]="form.invalid || form.pristine"
          />
        </div>
      </div>
    </form>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormComponent implements OnInit {
  public state = inject(DashboardStore);
  public sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
  public form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    first_name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    middle_name: new FormControl('', { nonNullable: true }),
    father_name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    mother_name: new FormControl('', { nonNullable: true }),
    document_id: new FormControl('', {
      nonNullable: true,
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email],
    }),
    phone_number: new FormControl('', {
      nonNullable: true,
    }),
    address: new FormControl('', { nonNullable: true }),
    birth_date: new FormControl<Date | undefined>(undefined, {
      nonNullable: true,
    }),
    start_date: new FormControl<Date | undefined>(undefined, {
      nonNullable: true,
    }),
    branch_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    department_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    position_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    gender: new FormControl<'F' | 'M'>('M', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    uniform_size: new FormControl<UniformSize | undefined>(undefined, {
      nonNullable: true,
    }),
    is_active: new FormControl(true, { nonNullable: true }),
    monthly_salary: new FormControl(0, { nonNullable: true }),
  });
  public dialog = inject(DynamicDialogRef);
  private info = inject(DynamicDialogConfig);

  ngOnInit() {
    const { employee } = this.info.data;
    if (employee) {
      this.form.patchValue(employee);
      this.form
        .get('birth_date')
        ?.patchValue(
          toDate(employee.birth_date, { timeZone: 'America/Panama' })
        );
      this.form
        .get('start_date')
        ?.patchValue(
          toDate(employee.start_date, { timeZone: 'America/Panama' })
        );
    }
  }

  async saveChanges() {
    await this.state
      .updateEmployee(this.form.getRawValue())
      .then(() => this.dialog.close())
      .catch((error) => console.log({ error }));
  }
}
