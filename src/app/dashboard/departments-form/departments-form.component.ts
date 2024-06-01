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
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { v4 } from 'uuid';
import { Department } from '../../models';
import { DashboardStore } from '../dashboard.store';

@Component({
  selector: 'app-departments-form',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    ReactiveFormsModule,
    MatDialogTitle,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: ` <form [formGroup]="form" (ngSubmit)="saveChanges()">
    <h2 mat-dialog-title>Area</h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Nombre</mat-label>
        <input type="text" matInput formControlName="name" />
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
export class DepartmentsFormComponent implements OnInit {
  public data: { department?: Department } = inject(MAT_DIALOG_DATA);
  form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  private dialog = inject(MatDialog);
  private state = inject(DashboardStore);

  ngOnInit() {
    const { department } = this.data;
    if (department) {
      this.form.patchValue(department);
    }
  }

  async saveChanges() {
    this.state
      .updateItem({
        request: this.form.getRawValue(),
        collection: 'departments',
      })
      .then(() => this.dialog.closeAll());
  }
}
