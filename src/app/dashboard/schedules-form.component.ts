import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { format } from 'date-fns';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { v4 } from 'uuid';
import { DashboardStore } from './dashboard.store';

@Component({
  selector: 'app-schedules-form',
  standalone: true,
  imports: [
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
  ],
  template: `<form [formGroup]="form" (ngSubmit)="saveChanges()">
    <div class="grid grid-cols-4 gap-3">
      <div class="input-container col-span-4">
        <label for="name">Nombre</label>
        <input pInputText id="name" type="text" formControlName="name" />
      </div>
      <div class="input-container">
        <label for="calendar-timeonly">Hora entrada</label>
        <p-calendar
          inputId="calendar-timeonly"
          timeOnly
          formControlName="entry_time"
          hourFormat="12"
          appendTo="body"
        />
      </div>
      <div class="input-container">
        <label for="formatted-hour">Hora inicio almuerzo</label>
        <p-calendar
          timeOnly
          formControlName="lunch_start_time"
          hourFormat="12"
          appendTo="body"
        />
      </div>
      <div class="input-container">
        <label for="formatted-hour">Hora fin almuerzo</label>
        <p-calendar
          timeOnly
          formControlName="lunch_end_time"
          hourFormat="12"
          appendTo="body"
        />
      </div>
      <div class="input-container">
        <label for="formatted-hour">Hora salida</label>
        <p-calendar
          timeOnly
          formControlName="exit_time"
          hourFormat="12"
          appendTo="body"
        />
      </div>
      <div class="input-container">
        <label for="minutes-tolerance">Tolerancia (minutos)</label>
        <p-inputNumber
          id="minutes-tolerance"
          formControlName="minutes_tolerance"
          [min]="0"
          [max]="60"
          showButtons
          step="5"
        />
      </div>
    </div>
    <div class="flex justify-end gap-4 items-center">
      <p-button
        label="Cancelar"
        severity="secondary"
        [outlined]="true"
        (click)="dialogRef.close()"
      />
      <p-button
        label="Guardar"
        icon="pi pi-save"
        type="submit"
        [loading]="state.loading()"
      />
    </div>
  </form> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulesFormComponent implements OnInit {
  public form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    entry_time: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lunch_start_time: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lunch_end_time: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    exit_time: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    minutes_tolerance: new FormControl(0, { nonNullable: true }),
  });

  public dialogRef = inject(DynamicDialogRef);
  private dialog = inject(DynamicDialogConfig);
  public state = inject(DashboardStore);
  private message = inject(MessageService);

  ngOnInit() {
    const { schedule } = this.dialog.data;
    if (schedule) {
      const { id, name, minutes_tolerance } = schedule;
      let { entry_time, lunch_end_time, lunch_start_time, exit_time } =
        schedule;
      entry_time = this.setTime(entry_time);
      lunch_end_time = this.setTime(lunch_end_time);
      lunch_start_time = this.setTime(lunch_start_time);
      exit_time = this.setTime(exit_time);
      this.form.patchValue({
        id,
        name,
        minutes_tolerance,
        entry_time,
        lunch_end_time,
        lunch_start_time,
        exit_time,
      });
    }
  }

  saveChanges() {
    if (this.form.invalid) {
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete todos los campos.',
      });
      this.form.markAllAsTouched();
      return;
    }
    const { id, name, minutes_tolerance } = this.form.getRawValue();
    let { entry_time, lunch_end_time, lunch_start_time, exit_time } =
      this.form.getRawValue();
    entry_time = format(entry_time, 'HH:mm:ss');
    lunch_end_time = format(lunch_end_time, 'HH:mm:ss');
    lunch_start_time = format(lunch_start_time, 'HH:mm:ss');
    exit_time = format(exit_time, 'HH:mm:ss');
    this.state
      .updateItem({
        request: {
          id,
          name,
          entry_time,
          lunch_end_time,
          lunch_start_time,
          exit_time,
          minutes_tolerance,
        },
        collection: 'schedules',
      })
      .then(() => this.dialogRef.close());
  }

  setTime(time: string) {
    const date = new Date();
    const [hours, minutes] = time.split(':');
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));
    date.setSeconds(0);
    return date;
  }
}
