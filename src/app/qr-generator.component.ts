import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import * as OTPAuth from 'otpauth';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import QRCode from 'qrcode';
import { from, map } from 'rxjs';
import { Employee } from './models';
import { SupabaseService } from './services/supabase.service';

@Component({
    selector: 'app-qr-generator',
    imports: [CardModule, ButtonModule, DropdownModule, FormsModule],
    template: `<div class="flex h-screen items-center justify-center w-full">
    <div class="w-full px-6 lg:w-1/3">
      <p-card header="Creacion de codigo QR">
        <div class="input-container">
          <label for="employee">Empleado</label>
          <p-dropdown
            [(ngModel)]="employee"
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
        <canvas id="canvas"></canvas>
        <p-button (onClick)="generateQrCode()">Click</p-button>
      </p-card>
    </div>
  </div> `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrGeneratorComponent {
  private supabase = inject(SupabaseService);
  public employee = model<Employee>();

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

  generateQrCode() {
    this.employees()!.forEach((employee) => {
      this.getQr(employee);
    });
  }

  getQr(employee: Employee) {
    const totp = new OTPAuth.TOTP({
      issuer: 'Peopletrak Blackdog',
      label: `${employee.first_name.trim()} ${employee.father_name.trim()}`,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
    });

    const uri = totp.toString();

    QRCode.toDataURL(uri, async (error, qrUrl) => {
      if (error) {
        console.error(error);
        return;
      }

      await this.supabase.client
        .from('employees')
        .update({ qr_code: qrUrl, code_uri: uri })
        .eq('id', employee.id);
    });
  }
}
