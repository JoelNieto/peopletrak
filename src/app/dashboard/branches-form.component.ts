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
import { Textarea } from 'primeng/textarea';
import { v4 } from 'uuid';

import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { DashboardStore } from './dashboard.store';

@Component({
  selector: 'pt-branches-form',
  imports: [
    ReactiveFormsModule,
    Button,
    InputText,
    Textarea,
    ToggleSwitch,
    Select,
  ],
  template: ` <form [formGroup]="form" (ngSubmit)="saveChanges()">
    <div class="flex flex-col gap-4">
      <div class="input-container">
        <label for="name">Nombre</label>
        <input type="text" pInputText formControlName="name" id="name" />
      </div>
      <div class="input-container">
        <label for="short_name">Abreviatura</label>
        <input
          type="text"
          pInputText
          formControlName="short_name"
          id="short_name"
        />
      </div>
      <div class="input-container">
        <label for="company_id">Empresa</label>
        <p-select
          formControlName="company_id"
          [options]="state.companies()"
          optionLabel="name"
          optionValue="id"
          placeholder="Seleccione una empresa"
          showClear
        />
      </div>
      <div class="input-container">
        <label for="ip">IP</label>
        <input type="text" pInputText formControlName="ip" id="ip" />
      </div>
      <div class="input-container">
        <label for="address">Direccion</label>
        <textarea pTextarea formControlName="address"></textarea>
      </div>
      <div class="flex items-center gap-2">
        <p-toggleswitch formControlName="is_active" inputId="active" />
        <label for="active">Activo</label>
      </div>

      <div class="flex gap-4 items-center justify-end">
        <p-button
          label="Cancelar"
          severity="secondary"
          [outlined]="true"
          (click)="dialogRef.close()"
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
export class BranchesFormComponent implements OnInit {
  form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    short_name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    address: new FormControl('', {
      nonNullable: true,
    }),
    company_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    ip: new FormControl('', { nonNullable: true }),
    is_active: new FormControl(true, { nonNullable: true }),
  });
  public dialogRef = inject(DynamicDialogRef);
  private dialog = inject(DynamicDialogConfig);
  public state = inject(DashboardStore);

  ngOnInit() {
    const { branch } = this.dialog.data;
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
      .then(() => this.dialogRef.close());
  }
}
