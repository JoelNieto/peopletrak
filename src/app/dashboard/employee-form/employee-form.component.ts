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
import { MatButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { v4 } from 'uuid';
import { Employee } from '../../models';
import { DashboardStore } from '../dashboard.store';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButton,
    ReactiveFormsModule,
    MatProgressBar,
  ],
  template: `
    @if (state.loading()) {
    <mat-progress-bar mode="query" />
    }
    <form [formGroup]="form" (ngSubmit)="saveChanges()">
      <h2 mat-dialog-title>Datos empleado</h2>
      <mat-dialog-content>
        <div class="flex flex-col md:grid grid-cols-4 md:gap-4">
          <mat-form-field>
            <mat-label>Nombre</mat-label>
            <input type="text" matInput formControlName="first_name" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Segundo Nombre</mat-label>
            <input type="text" matInput formControlName="middle_name" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Apellido</mat-label>
            <input type="text" matInput formControlName="father_name" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Apellido materno/casada</mat-label>
            <input type="text" matInput formControlName="mother_name" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Fecha de nacimiento</mat-label>
            <input
              matInput
              [matDatepicker]="birthdate"
              formControlName="birth_date"
            />
            <mat-hint>DD/MM/AAAA</mat-hint>
            <mat-datepicker-toggle matIconSuffix [for]="birthdate" />
            <mat-datepicker #birthdate />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Cedula</mat-label>
            <input type="text" matInput formControlName="document_id" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Direccion</mat-label>
            <input type="text" matInput formControlName="address" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Email</mat-label>
            <input type="email" matInput formControlName="email" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Nro. Telefono</mat-label>
            <input type="text" matInput formControlName="phone_number" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Sexo</mat-label>
            <mat-select formControlName="gender">
              <mat-option value="F">F</mat-option>
              <mat-option value="M">M</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Sucursal</mat-label>
            <mat-select formControlName="branch_id">
              @for (branch of state.branches(); track branch.id) {
              <mat-option [value]="branch.id">{{ branch.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Area</mat-label>
            <mat-select formControlName="department_id">
              @for (department of state.departments(); track department.id) {
              <mat-option [value]="department.id"
                >{{ department.name }}
              </mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Cargo</mat-label>
            <mat-select formControlName="position_id">
              @for (position of state.positions(); track position.id) {
              <mat-option [value]="position.id">{{ position.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field floatLabel="always">
            <mat-label>Salario</mat-label>
            <input
              matInput
              type="number"
              class="example-right-align"
              placeholder="0"
              formControlName="monthly_salary"
            />
            <span matTextPrefix>$&nbsp;</span>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Fecha de inicio</mat-label>
            <input
              matInput
              [matDatepicker]="startdate"
              formControlName="start_date"
            />
            <mat-hint>DD/MM/AAAA</mat-hint>
            <mat-datepicker-toggle matIconSuffix [for]="startdate" />
            <mat-datepicker #startdate />
          </mat-form-field>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-stroked-button mat-dialog-close type="button">
          Cancelar
        </button>
        <button mat-flat-button type="submit">Guardar cambios</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormComponent implements OnInit {
  public state = inject(DashboardStore);
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
    monthly_salary: new FormControl(0, { nonNullable: true }),
  });
  private dialog = inject(MatDialog);
  private data: { employee?: Employee } = inject(MAT_DIALOG_DATA);

  ngOnInit() {
    const { employee } = this.data;
    if (employee) this.form.patchValue(employee);
  }

  async saveChanges() {
    await this.state.updateEmployee(this.form.getRawValue());
    this.dialog.closeAll();
  }
}
