import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Position } from '../../models';
import { DashboardStore } from '../dashboard.store';
import { PositionsFormComponent } from '../positions-form/positions-form.component';

@Component({
  selector: 'app-positions',
  standalone: true,
  imports: [
    MatMenuModule,
    MatIcon,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTableModule,
    TableModule,
    CardModule,
    ButtonModule,
  ],
  providers: [DynamicDialogRef, DialogService],
  template: `
    <p-card header="Cargos" subheader="Listado de cargos de la empresa">
      <div class="w-full flex justify-end">
        <p-button label="Agregar" (click)="editPosition()" />
      </div>
      <p-table
        [value]="state.positions()"
        [paginator]="true"
        [rowsPerPageOptions]="[5, 10, 20]"
        [rows]="5"
      >
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="name">
              Nombre
              <p-sortIcon field="name" />
            </th>
            <th pSortableColumn="department.name">
              Area
              <p-sortIcon field="department.name" />
            </th>
            <th></th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-item>
          <tr>
            <td>{{ item.name }}</td>
            <td>{{ item.department?.name }}</td>
            <td>
              <p-button
                severity="success"
                [text]="true"
                [rounded]="true"
                icon="pi pi-pen-to-square"
                (click)="editPosition(item)"
              />
              <p-button
                severity="danger"
                [text]="true"
                [rounded]="true"
                icon="pi pi-trash"
              />
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PositionsComponent {
  readonly state = inject(DashboardStore);

  private dialog = inject(DialogService);
  private ref = inject(DynamicDialogRef);

  editPosition(position?: Position) {
    this.ref = this.dialog.open(PositionsFormComponent, {
      header: 'Cargo',
      width: '36rem',
      data: { position },
    });
  }
}
