import { httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { PayrollPayment } from '../models';
import { PayrollPaymentsFormComponent } from './payroll-payments-form.component';

@Component({
  selector: 'pt-payroll-payments',
  imports: [TableModule, Button, RouterLink],
  providers: [DynamicDialogRef, DialogService],
  template: `
    <p-table
      [value]="payments.value() ?? []"
      [loading]="payments.isLoading()"
      [paginator]="true"
      [rows]="10"
    >
      <ng-template #caption>
        <div class="flex justify-end">
          <p-button
            label="Procesar pago"
            icon="pi pi-plus-circle"
            severity="success"
            rounded
            (click)="generatePayment()"
          />
        </div>
      </ng-template>
      <ng-template pTemplate="header">
        <tr>
          <th>Fecha Inicio</th>
          <th>Fecha Fin</th>
          <th>Estado</th>
          <th></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-payment>
        <tr>
          <td>{{ payment.start_date }}</td>
          <td>{{ payment.end_date }}</td>
          <td>{{ payment.status }}</td>
          <td>
            <p-button
              label="Ver"
              icon="pi pi-eye"
              severity="info"
              rounded
              [routerLink]="['payments', payment.id]"
            />
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayrollPaymentsComponent {
  public payrollId = input.required<string>();
  public dialogService = inject(DialogService);

  public payments = httpResource<PayrollPayment[]>(() => ({
    url: `${process.env['ENV_SUPABASE_URL']}/rest/v1/payroll_payments`,
    method: 'GET',
    params: {
      select: '*',
      payroll_id: `eq.${this.payrollId()}`,
    },
  }));

  generatePayment() {
    this.dialogService.open(PayrollPaymentsFormComponent, {
      data: {
        payrollId: this.payrollId(),
      },
      modal: true,
      width: '48rem',
      header: 'Pago',
    });
  }
}
