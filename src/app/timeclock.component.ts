import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputOtpModule } from 'primeng/inputotp';
import { from, map } from 'rxjs';
import { TOTP } from 'totp-generator';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-timeclock',
  standalone: true,
  imports: [InputOtpModule, DropdownModule, ButtonModule],
  template: `<div class="flex flex-col items-center w-full">
    <div
      class="flex flex-col gap-6 w-full lg:w-1/4 items-center h-screen justify-center px-6"
    >
      <div class="text-2xl">Timeclock</div>
      <div class="input-container">
        <p-dropdown
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
          [options]="employees() ?? []"
          placeholder="Seleccionar empleado"
          optionValue="id"
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
      <p-inputOtp [length]="6" />
      <p-button (onClick)="generateOtp()" label="Click" />
    </div>
  </div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeclockComponent {
  protected supabase = inject(SupabaseService);

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

  generateOtp() {
    const { otp, expires } = TOTP.generate('JBSWY3DPEHPK3PXP');
    console.log({ otp, expires });
  }
}
