import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as OTPAuth from 'otpauth';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputOtpModule } from 'primeng/inputotp';
import { ToastModule } from 'primeng/toast';
import { from, map } from 'rxjs';
import { Employee } from './models';
import { SupabaseService } from './services/supabase.service';
@Component({
  selector: 'app-timeclock',
  standalone: true,
  imports: [
    InputOtpModule,
    DropdownModule,
    ButtonModule,
    ReactiveFormsModule,
    ToastModule,
    CardModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  template: `<p-confirmDialog /><p-toast />
    <div class="flex flex-col items-center w-full">
      <div
        class="flex flex-col gap-6 w-full lg:w-1/3 items-center h-screen justify-center px-6"
      >
        <p-card
          class="w-full"
          header="Reloj de Marcación"
          subheader="Seleccione la empresa, sucursal y empleado"
        >
          <form [formGroup]="form" class="flex flex-col gap-3 items-center">
            <div class="input-container">
              <p-dropdown
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
              <p-dropdown
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
              <p-dropdown
                formControlName="employee"
                [options]="employees() ?? []"
                placeholder="Seleccionar empleado"
                filter
                filterBy="first_name,father_name"
              >
                <ng-template pTemplate="selectedItem" let-selected>
                  {{ selected.father_name }}, {{ selected.first_name }}
                </ng-template>
                <ng-template let-item pTemplate="item">
                  {{ item.father_name }}, {{ item.first_name }}
                </ng-template>
              </p-dropdown>
            </div>
            <p-inputOtp formControlName="otp" [length]="6" />
            <p-button
              [disabled]="form.invalid"
              (onClick)="validateOtp()"
              label="Marcar"
              icon="pi pi-clock"
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
    otp: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    }),
  });

  async validateOtp() {
    const { employee, otp, branch_id, company_id } = this.form.getRawValue();
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
      const { error } = await this.supabase.client.from('timestamps').insert({
        employee_id: employee.id,
        branch_id,
        company_id,
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
        message: `Marcación registrada exitosamente a las ${new Date().toLocaleTimeString()}`,
        header: 'Éxito',
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
