import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Company } from '../models';
import { CompaniesFormComponent } from './companies-form.component';
import { DashboardStore } from './dashboard.store';

@Component({
  selector: 'app-companies',
  imports: [Card, Button, TableModule],
  providers: [DynamicDialogRef, DialogService],
  template: `<p-card>
    <ng-template #subtitle>Listado de empresas</ng-template>
    <ng-template #title>Empresas</ng-template>
    <div class="w-full flex justify-end">
      <p-button
        label="Agregar"
        icon="pi pi-plus-circle"
        (onClick)="editCompany()"
      />
    </div>
    <div>
      <p-table
        [value]="store.companies()"
        [paginator]="true"
        [rows]="5"
        [rowsPerPageOptions]="[5, 10, 20]"
      >
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="name">Nombre <p-sortIcon field="name" /></th>
            <th pSortableColumn="phone_number">
              Nro. Telefono <p-sortIcon field="phone_number" />
            </th>
            <th pSortableColumn="address">
              Direccion <p-sortIcon field="address" />
            </th>
            <th></th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-item>
          <tr>
            <td>{{ item.name }}</td>
            <td>{{ item.phone_number }}</td>
            <td>{{ item.address }}</td>
            <td>
              <p-button
                severity="success"
                [text]="true"
                [rounded]="true"
                icon="pi pi-pen-to-square"
                (onClick)="editCompany(item)"
              />
              <p-button
                severity="danger"
                [text]="true"
                [rounded]="true"
                icon="pi pi-trash"
                (onClick)="deleteCompany(item.id)"
              />
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  </p-card>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompaniesComponent {
  protected store = inject(DashboardStore);
  private dialog = inject(DialogService);

  editCompany(company?: Company) {
    this.dialog.open(CompaniesFormComponent, {
      header: 'Agregar empresa',
      width: '36rem',
      data: { company },
    });
  }

  deleteCompany(id: string) {
    this.store.deleteItem({ id, collection: 'companies' });
  }
}
