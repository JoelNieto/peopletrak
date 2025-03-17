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
import { ToggleSwitch } from 'primeng/toggleswitch';
import { v4 } from 'uuid';
import { DashboardStore } from '../stores/dashboard.store';

@Component({
  selector: 'pt-companies-form',
  imports: [ReactiveFormsModule, InputText, Textarea, Button, ToggleSwitch],
  template: `<form [formGroup]="form" (ngSubmit)="saveChanges()">
    <div class="flex flex-col gap-4">
      <div class="input-container">
        <label for="name">Nombre</label>
        <input type="text" pInputText formControlName="name" id="name" />
      </div>
      <div class="input-container">
        <label for="address">Direccion</label>
        <textarea pTextarea formControlName="address"></textarea>
      </div>
      <div class="input-container">
        <label for="address">Nro. de Telefono</label>
        <input pInputText type="tel" formControlName="phone_number" />
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
export class CompaniesFormComponent implements OnInit {
  form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    address: new FormControl('', {}),
    phone_number: new FormControl('', {}),
    is_active: new FormControl(true, {}),
  });
  public dialogRef = inject(DynamicDialogRef);
  private dialog = inject(DynamicDialogConfig);
  public state = inject(DashboardStore);

  ngOnInit() {
    const { company } = this.dialog.data;
    if (company) {
      this.form.patchValue(company);
    }
  }

  async saveChanges() {
    this.state
      .updateItem({
        request: this.form.getRawValue(),
        collection: 'companies',
      })
      .then(() => this.dialogRef.close());
  }
}
