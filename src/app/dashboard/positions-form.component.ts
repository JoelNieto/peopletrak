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
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { v4 } from 'uuid';

import { Select } from 'primeng/select';
import { DashboardStore } from './dashboard.store';

@Component({
  selector: 'app-positions-form',
  imports: [ReactiveFormsModule, Button, InputText, Select],
  template: ` <form [formGroup]="form" (ngSubmit)="saveChanges()">
    <div class="flex flex-col gap-4">
      <div class="input-container">
        <label for="name">Nombre</label>
        <input type="text" pInputText id="name" formControlName="name" />
      </div>
      <div class="input-container">
        <label for="company"> Empresa</label>
        <p-select
          id="company"
          appendTo="body"
          [options]="state.companies()"
          optionValue="id"
          optionLabel="name"
          formControlName="company_id"
          placeholder="Seleccione una empresa"
        />
      </div>
      <div class="input-container">
        <label for="department"> Area</label>
        <p-select
          id="department"
          appendTo="body"
          [options]="state.departments()"
          optionValue="id"
          optionLabel="name"
          formControlName="department_id"
          placeholder="Seleccione un area"
        />
      </div>
      <div class="dialog-actions">
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
  </form>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PositionsFormComponent implements OnInit {
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
    company_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  public state = inject(DashboardStore);
  public dialog = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig);

  ngOnInit() {
    const { position } = this.dialogConfig.data;
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
      .then(() => this.dialog.close());
  }
}
