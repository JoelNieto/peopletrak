import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { Select } from 'primeng/select';
import { iif } from 'rxjs';
import { markGroupDirty } from '../services/util.service';
import { CompaniesStore } from '../stores/companies.store';
import { DepartmentsStore } from '../stores/departments.store';

@Component({
  selector: 'pt-departments-form',
  imports: [ReactiveFormsModule, Button, InputText, Select],
  template: ` <form [formGroup]="form" (ngSubmit)="saveChanges()">
    <div class="flex flex-col gap-4">
      <div class="input-container">
        <label for="name">Nombre</label>
        <input type="text" id="name" pInputText formControlName="name" />
      </div>
      <div class="input-container">
        <label for="company_id">Empresa</label>
        <p-select
          formControlName="company_id"
          [options]="companies.entities()"
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
          [loading]="state.isLoading()"
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
  public state = inject(DepartmentsStore);
  public companies = inject(CompaniesStore);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    const { department } = this.dialog.data;
    if (department) {
      this.form.patchValue(department);
    }
  }

  async saveChanges() {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete los campos requeridos',
      });
      markGroupDirty(this.form);
      return;
    }
    if (this.form.pristine) {
      this.messageService.add({
        severity: 'info',
        detail: 'No se realizaron cambios',
        summary: 'Info',
      });
      this.dialogRef.close();
      return;
    }
    iif(
      () => this.dialog.data.department,
      this.state.editItem(this.form.getRawValue()),
      this.state.createItem(this.form.getRawValue())
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.dialogRef.close();
      });
  }
}
