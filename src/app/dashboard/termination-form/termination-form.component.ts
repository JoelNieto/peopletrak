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
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { v4 } from 'uuid';
import { Employee } from '../../models';
import { DashboardStore } from '../dashboard.store';

@Component({
  selector: 'app-termination-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepicker,
    MatDatepickerModule,
    MatButton,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="saveChanges()">
      <h2 mat-dialog-title>Terminacion de empleado</h2>
      <mat-dialog-content>
        <div class="grid grid-cols-2 gap-4">
          <mat-form-field>
            <mat-label>Empleado</mat-label>
            <mat-select formControlName="employee_id">
              @for (employee of store.employeesList(); track employee.id) {
              <mat-option [value]="employee.id"
                >{{ employee.first_name }} {{ employee.father_name }}
              </mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Fecha efectiva</mat-label>
            <input
              matInput
              [matDatepicker]="startdate"
              formControlName="date"
            />
            <mat-hint>DD/MM/AAAA</mat-hint>
            <mat-datepicker-toggle matIconSuffix [for]="startdate" />
            <mat-datepicker #startdate />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Motivo</mat-label>
            <mat-select formControlName="reason">
              <mat-option value="DESPIDO">Despido</mat-option>
              <mat-option value="RENUNCIA">Renuncia</mat-option>
              <mat-option value="FIN_CONTRATO">Fin de contrato</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <mat-form-field class="mb-2">
          <mat-label>Apuntes</mat-label>
          <textarea matInput formControlName="notes"></textarea>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-stroked-button mat-dialog-close type="button">
          Cancelar
        </button>
        <button mat-flat-button type="submit" [disabled]="form.invalid">
          Guardar cambios
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TerminationFormComponent implements OnInit {
  public store = inject(DashboardStore);
  public data: { employee?: Employee } = inject(MAT_DIALOG_DATA);
  public form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    employee_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    reason: new FormControl<'DESPIDO' | 'RENUNCIA' | 'FIN_CONTRATO'>(
      'DESPIDO',
      {
        nonNullable: true,
        validators: [Validators.required],
      }
    ),
    date: new FormControl<Date>(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    notes: new FormControl('', { nonNullable: true }),
  });
  private dialog = inject(MatDialogRef);

  ngOnInit() {
    const { employee } = this.data;
    if (employee) {
      this.form.get('employee_id')?.patchValue(employee.id);
    }
  }

  saveChanges() {
    this.store
      .terminateEmployee(this.form.getRawValue())
      .then(() => this.dialog.close());
  }
}
