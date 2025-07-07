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
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';

@Component({
  selector: 'pt-late-compensatory-form',
  imports: [Select, InputNumber, InputText, Button, ReactiveFormsModule],
  template: `<form [formGroup]="form">
    <div class="flex flex-col gap-4">
      <div class="input-container">
        <label for="cause">Causa</label>
        <p-select
          id="cause"
          fluid
          formControlName="cause"
          optionLabel="label"
          optionValue="value"
          [options]="absenceCauses"
          placeholder="---Seleccione una causa---"
          filter
          filterBy="label"
          appendTo="body"
        />
      </div>
      <div class="input-container">
        <label for="hours">Horas</label>
        <p-inputNumber
          id="hours"
          fluid
          formControlName="hours"
          minFractionDigits="2"
          maxFractionDigits="2"
          appendTo="body"
        />
      </div>
      <div class="input-container">
        <label for="notes">Notas</label>
        <input
          pInputText
          id="notes"
          fluid
          formControlName="notes"
          appendTo="body"
        />
      </div>
    </div>
    <div class="dialog-actions">
      <p-button
        label="Cancelar"
        icon="pi pi-times"
        severity="secondary"
        rounded
        (click)="dialogRef.close()"
      />
      <p-button
        label="Aceptar"
        icon="pi pi-check"
        severity="success"
        rounded
        (click)="dialogRef.close(form.value)"
      />
    </div>
  </form>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LateCompensatoryFormComponent implements OnInit {
  public form = new FormGroup({
    cause: new FormControl('', [Validators.required]),
    notes: new FormControl('', [Validators.required]),
    hours: new FormControl(0, [Validators.required]),
  });

  public absenceCauses = [
    { value: 'PERSONAL', label: 'Personal' },
    { value: 'INJUSTIFICADA', label: 'Injustificada' },
    { value: 'JUSTIFICADA', label: 'Justificada' },
    { value: 'COMPENSATORIO', label: 'Compensatorio' },
  ];

  public dialogRef = inject(DynamicDialogRef);
  public dialogConfig = inject(DynamicDialogConfig);

  public ngOnInit(): void {
    const { hours } = this.dialogConfig.data;
    this.form.patchValue({ hours });
  }
}
