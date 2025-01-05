import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { format } from 'date-fns';
import * as OTPAuth from 'otpauth';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputOtp } from 'primeng/inputotp';
import { Select } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { from, map } from 'rxjs';
import { Employee, TimelogType } from './models';
import { TrimPipe } from './pipes/trim.pipe';
import { SupabaseService } from './services/supabase.service';
@Component({
  selector: 'app-timeclock',
  imports: [
    InputOtp,
    Select,
    Button,
    ReactiveFormsModule,
    ToastModule,
    Card,
    ConfirmDialogModule,
    TrimPipe,
  ],
  providers: [ConfirmationService],
  template: `<p-confirmDialog /><p-toast />
    <div
      class="flex flex-col items-center w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
    >
      <div
        class="flex flex-col gap-6 w-full lg:w-1/2 items-center h-screen justify-center px-6"
      >
        <p-card class="w-full">
          <ng-template #title>Reloj de Marcación</ng-template>
          <ng-template #subtitle
            >Seleccione la empresa, sucursal y empleado</ng-template
          >
          <form [formGroup]="form" class="flex flex-col gap-3 items-center">
            <div class="input-container">
              <p-select
                formControlName="company_id"
                [options]="companies() ?? []"
                placeholder="Seleccionar empresa"
                optionLabel="name"
                optionValue="id"
                filter
                filterBy="name"
              />
            </div>
            <div class="input-container">
              <p-select
                formControlName="branch_id"
                [options]="branches() ?? []"
                placeholder="Seleccionar sucursal"
                optionValue="id"
                optionLabel="name"
                filter
                filterBy="name"
              />
            </div>
            <div class="input-container">
              <p-select
                formControlName="employee"
                [options]="employees() ?? []"
                placeholder="Seleccionar empleado"
                filter
                filterBy="first_name,father_name"
              >
                <ng-template pTemplate="selectedItem" let-selected>
                  {{ selected.father_name | trim }},
                  {{ selected.first_name | trim }}
                </ng-template>
                <ng-template let-item pTemplate="item">
                  {{ item.father_name | trim }}, {{ item.first_name | trim }}
                </ng-template>
              </p-select>
            </div>
            <div class="input-container">
              <p-select
                formControlName="type"
                placeholder="Seleccionar tipo"
                [options]="types"
                optionLabel="label"
                optionValue="value"
              />
            </div>
            <p-inputOtp
              formControlName="otp"
              [length]="6"
              [integerOnly]="true"
            />

            <p-button
              [disabled]="form.invalid"
              (onClick)="validateOtp()"
              label="Marcar"
              icon="pi pi-clock"
              size="large"
            />
          </form>
        </p-card>
      </div>
    </div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeclockComponent {
  protected supabase = inject(SupabaseService);
  private message = inject(MessageService);
  private confirmation = inject(ConfirmationService);

  public types = Object.entries(TimelogType).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  public companies = toSignal(
    from(this.supabase.client.from('companies').select('*').order('name')).pipe(
      map((response) => response.data)
    ),
    {
      initialValue: [],
    }
  );

  public branches = toSignal(
    from(this.supabase.client.from('branches').select('*').order('name')).pipe(
      map((response) => response.data)
    ),
    {
      initialValue: [],
    }
  );

  public employees = toSignal(
    from(
      this.supabase.client
        .from('employees')
        .select('*')
        .order('father_name')
        .eq('is_active', true)
    ).pipe(map((response) => response.data)),
    {
      initialValue: [],
    }
  );

  public form = new FormGroup({
    company_id: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    branch_id: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    employee: new FormControl<Employee | undefined>(undefined, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    type: new FormControl<TimelogType>(TimelogType.entry, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    otp: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    }),
  });

  async validateOtp() {
    const { employee, otp, branch_id, company_id, type } =
      this.form.getRawValue();
    if (employee?.code_uri) {
      const totp = OTPAuth.URI.parse(employee.code_uri);
      const validation = totp.validate({ token: otp });
      if (validation === null) {
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Código incorrecto',
        });
        this.form.get('otp')?.reset();
        return;
      }
      const { error } = await this.supabase.client.from('timelogs').insert({
        employee_id: employee.id,
        branch_id,
        company_id,
        type,
      });
      if (error) {
        console.error(error);
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Algo salió mal, intente nuevamente',
        });
        return;
      }
      this.confirmation.confirm({
        message: `Marcación registrada exitosamente a las <b>${format(
          new Date(),
          'h:mm:ss aaa'
        )}</b>`,
        header: 'Éxito',
        icon: 'pi pi-check',
        acceptLabel: 'Aceptar',
        rejectVisible: false,
        accept: () => {
          this.form.get('otp')?.reset();
          this.form.get('employee')?.reset();
        },
      });
    }
  }
}
