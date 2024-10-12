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
import { InputTextModule } from 'primeng/inputtext';
import { v4 } from 'uuid';

import { DropdownModule } from 'primeng/dropdown';
import { DashboardStore } from './dashboard.store';

@Component({
  selector: 'app-departments-form',
  standalone: true,
  imports: [ReactiveFormsModule, Button, InputTextModule, DropdownModule],
  template: ` <form [formGroup]="form" (ngSubmit)="saveChanges()">
    <div class="flex flex-col gap-4">
      <div class="input-container">
        <label for="name">Nombre</label>
        <input type="text" id="name" pInputText formControlName="name" />
      </div>
      <div class="input-container">
        <label for="company_id">Empresa</label>
        <p-dropdown
          formControlName="company_id"
          [options]="state.companies()"
          optionLabel="name"
          optionValue="id"
          placeholder="Seleccione una empresa"
          showClear
          appendTo="body"
        />
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
export class DepartmentsFormComponent implements OnInit {
  form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    company_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  public dialogRef = inject(DynamicDialogRef);
  private dialog = inject(DynamicDialogConfig);
  public state = inject(DashboardStore);

  ngOnInit() {
    const { department } = this.dialog.data;
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
      .then(() => this.dialogRef.close());
  }
}
