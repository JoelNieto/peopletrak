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
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { v4 } from 'uuid';
import { DashboardStore } from './dashboard.store';

@Component({
  selector: 'app-companies-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    InputSwitchModule,
  ],
  template: `<form [formGroup]="form" (ngSubmit)="saveChanges()">
    <div class="flex flex-col gap-4">
      <div class="input-container">
        <label for="name">Nombre</label>
        <input type="text" pInputText formControlName="name" id="name" />
      </div>
      <div class="input-container">
        <label for="address">Direccion</label>
        <textarea pInputTextarea formControlName="address"></textarea>
      </div>
      <div class="input-container">
        <label for="address">Nro. de Telefono</label>
        <input pInputText type="tel" formControlName="phone_number" />
      </div>
      <div class="flex items-center gap-2">
        <p-inputSwitch formControlName="is_active" inputId="active" />
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
    console.log(crypto.randomUUID());
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
