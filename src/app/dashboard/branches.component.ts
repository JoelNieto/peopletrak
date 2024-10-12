import { DialogModule } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';

import { Branch } from '../models';
import { BranchesFormComponent } from './branches-form.component';
import { DashboardStore } from './dashboard.store';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [ButtonModule, CardModule, TableModule, DialogModule],
  providers: [DynamicDialogRef, DialogService],
  template: `
    <p-card
      header="Sucursales"
      subheader="Listado de sucursales/localidades activas en la empresa"
    >
      <div class="w-full flex justify-end">
        <p-button label="Agregar" (click)="editBranch()" />
      </div>
      <div>
        <p-table
          [value]="state.branches()"
          [paginator]="true"
          [rows]="5"
          [rowsPerPageOptions]="[5, 10, 20]"
        >
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="name">
                Nombre
                <p-sortIcon field="name" />
              </th>
              <th pSortableColumn="address">
                Direccion
                <p-sortIcon field="address" />
              </th>
              <th></th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr>
              <td>{{ item.name }}</td>
              <td>{{ item.address }}</td>
              <td>
                <p-button
                  severity="success"
                  icon="pi pi-pen-to-square"
                  [rounded]="true"
                  [text]="true"
                  (onClick)="editBranch(item)"
                />
                <p-button
                  severity="danger"
                  icon="pi pi-trash"
                  [rounded]="true"
                  [text]="true"
                  (onClick)="deleteBranch(item.id)"
                />
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </p-card>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchesComponent {
  readonly state = inject(DashboardStore);
  private ref = inject(DynamicDialogRef);
  private dialogService = inject(DialogService);

  editBranch(branch?: Branch) {
    this.ref = this.dialogService.open(BranchesFormComponent, {
      width: '36rem',
      data: { branch },
      header: 'Sucursal',
    });
  }

  deleteBranch(id: string) {
    this.state.deleteItem({ id, collection: 'branches' });
  }
}
