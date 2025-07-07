import { CurrencyPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Button } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { PayrollDebt } from '../models';
import { PayrollDebtsFormComponent } from './payroll-debts-form.component';

@Component({
  selector: 'pt-payroll-debts',
  providers: [DynamicDialogRef, DialogService],
  imports: [TableModule, Button, CurrencyPipe],
  template: `<p-table
    [value]="debts.value() || []"
    paginator
    [rows]="10"
    showCurrentPageReport
    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} empleados"
    ><ng-template #caption>
      <div class="flex justify-end">
        <p-button
          label="Agregar"
          icon="pi pi-plus-circle"
          rounded
          (onClick)="editDebt()"
        />
      </div>
    </ng-template>
    <ng-template #header>
      <tr>
        <th pSortableColumn="employee">
          Empleado
          <p-sortIcon field="employee" />
        </th>
        <th>Acreedor</th>
        <th>Monto</th>
        <th>Fecha de inicio</th>
        <th>Fecha de vencimiento</th>
        <th>Saldo</th>
        <th>Descripción</th>
        <th></th>
      </tr>
    </ng-template>
    <ng-template #body let-item>
      <tr>
        <td>{{ item.employee.first_name }} {{ item.employee.father_name }}</td>
        <td>{{ item.creditor.name }}</td>
        <td>{{ item.amount | currency : '$' }}</td>
        <td>{{ item.start_date }}</td>
        <td>{{ item.due_date }}</td>
        <td>{{ item.balance | currency : '$' }}</td>
        <td>{{ item.description }}</td>
        <td>
          <p-button
            severity="success"
            text
            rounded
            icon="pi pi-pen-to-square"
            (onClick)="editDebt(item)"
          />
          <p-button severity="danger" text rounded icon="pi pi-trash" />
        </td>
      </tr>
    </ng-template>
  </p-table>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayrollDebtsComponent {
  public payrollId = input.required<string>();
  public debts = httpResource<PayrollDebt[]>(() => ({
    url: `${process.env['ENV_SUPABASE_URL']}/rest/v1/payroll_debts`,
    method: 'GET',
    params: {
      select:
        '*, employee:employees(id, first_name, father_name, payroll:employee_payrolls(*)), creditor:creditors(*)',
      payroll_id: `eq.${this.payrollId()}`,
    },
  }));

  private dialogService = inject(DialogService);

  public editDebt(debt?: PayrollDebt) {
    this.dialogService
      .open(PayrollDebtsFormComponent, {
        data: {
          payrollId: this.payrollId(),
          debt,
        },
        modal: true,
        width: '70vw',
        header: 'Detalles de deuda',
        breakpoints: {
          '960px': '75vw',
          '640px': '90vw',
        },
      })
      .onClose.subscribe(() => {
        this.debts.reload();
      });
  }
}
