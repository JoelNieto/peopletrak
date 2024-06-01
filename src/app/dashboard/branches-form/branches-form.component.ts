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
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';

import { v4 } from 'uuid';
import { Branch } from '../../models';
import { DashboardStore } from '../dashboard.store';

@Component({
  selector: 'app-branches-form',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSlideToggle,
  ],
  template: ` <form [formGroup]="form" (ngSubmit)="saveChanges()">
    <h2 mat-dialog-title>Sucursal</h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Nombre</mat-label>
        <input type="text" matInput formControlName="name" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Direccion</mat-label>
        <textarea matInput formControlName="address"></textarea>
      </mat-form-field>
      <mat-slide-toggle formControlName="is_active">Activo</mat-slide-toggle>
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
export class BranchesFormComponent implements OnInit {
  public data: { branch?: Branch } = inject(MAT_DIALOG_DATA);
  form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    address: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    is_active: new FormControl(true, { nonNullable: true }),
  });
  private dialog = inject(MatDialog);
  private state = inject(DashboardStore);

  ngOnInit() {
    const { branch } = this.data;
    if (branch) {
      this.form.patchValue(branch);
    }
  }

  async saveChanges() {
    this.state
      .updateItem({
        request: this.form.getRawValue(),
        collection: 'branches',
      })
      .then(() => this.dialog.closeAll());
  }
}
