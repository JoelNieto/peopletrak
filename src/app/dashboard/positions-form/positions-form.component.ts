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
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { v4 } from 'uuid';
import { Position } from '../../models';
import { DashboardStore } from '../dashboard.store';

@Component({
  selector: 'app-positions-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: ` <form [formGroup]="form" (ngSubmit)="saveChanges()">
    <h2 mat-dialog-title>Cargo</h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Nombre</mat-label>
        <input type="text" matInput formControlName="name" />
      </mat-form-field>
      <mat-form-field>
        <mat-label> Area</mat-label>
        <mat-select formControlName="department_id">
          @for (department of state.departments(); track department.id) {
          <mat-option [value]="department.id"
            >{{ department.name }}
          </mat-option>
          }
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-stroked-button mat-dialog-close type="button">
        Cancelar
      </button>
      <button
        mat-flat-button
        type="submit"
        [disabled]="form.invalid || form.pristine"
      >
        Guardar cambios
      </button>
    </mat-dialog-actions>
  </form>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PositionsFormComponent implements OnInit {
  public data: { position?: Position } = inject(MAT_DIALOG_DATA);
  form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    department_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  public state = inject(DashboardStore);
  private dialog = inject(MatDialog);

  ngOnInit() {
    const { position } = this.data;
    if (position) {
      this.form.patchValue(position);
    }
  }

  async saveChanges() {
    this.state
      .updateItem({
        request: this.form.getRawValue(),
        collection: 'positions',
      })
      .then(() => this.dialog.closeAll());
  }
}
