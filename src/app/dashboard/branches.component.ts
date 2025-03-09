import { DialogModule } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';

import { Branch } from '../models';
import { BranchesFormComponent } from './branches-form.component';
import { DashboardStore } from './dashboard.store';

@Component({
  selector: 'pt-branches',
  imports: [ButtonModule, CardModule, TableModule, DialogModule],
  providers: [DynamicDialogRef, DialogService],
  template: `
    <p-card>
      <ng-template #title>Sucursales</ng-template>
      <ng-template #subtitle
        >Listado de sucursales/localidades activas en la empresa"</ng-template
      >
      <div class="w-full flex justify-end">
        <p-button label="Agregar" (click)="editBranch()" />
      </div>
      <div>
        <p-table
          [value]="branches()"
          [paginator]="true"
          [rows]="5"
          [rowsPerPageOptions]="[5, 10, 20]"
        >
          <ng-template #header>
            <tr>
              <th pSortableColumn="name">
                Nombre
                <p-sortIcon field="name" />
              </th>
              <th pSortableColumn="short_name">
                Abreviatura
                <p-sortIcon field="name" />
              </th>
              <th pSortableColumn="address">
                Direccion
                <p-sortIcon field="address" />
              </th>
              <th></th>
            </tr>
          </ng-template>
          <ng-template #body let-item>
            <tr>
              <td>{{ item.name }}</td>
              <td>{{ item.short_name }}</td>
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
  public branches = computed(() => [...this.state.branches()]);

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
