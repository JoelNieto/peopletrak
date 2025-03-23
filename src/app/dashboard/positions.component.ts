import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';

import { Position } from '../models';
import { PositionsStore } from '../stores/positions.store';
import { PositionsFormComponent } from './positions-form.component';

@Component({
  selector: 'pt-positions',
  imports: [TableModule, Card, Button],
  providers: [DynamicDialogRef, DialogService],
  template: `
    <p-card>
      <ng-template #title>Cargos</ng-template>
      <ng-template #subtitle>Listado de cargos de la empresa</ng-template>
      <div class="w-full flex justify-end">
        <p-button label="Agregar" (click)="editPosition()" />
      </div>
      <p-table
        [value]="positions()"
        [paginator]="true"
        [rowsPerPageOptions]="[5, 10, 20]"
        [rows]="5"
      >
        <ng-template #header>
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
        <ng-template #body let-item>
          <tr>
            <td>{{ item.name }}</td>
            <td>{{ item.department?.name }}</td>
            <td>
              <p-button
                severity="success"
                [text]="true"
                [rounded]="true"
                icon="pi pi-pen-to-square"
                (onClick)="editPosition(item)"
              />
              <p-button
                severity="danger"
                [text]="true"
                [rounded]="true"
                icon="pi pi-trash"
                (onClick)="deletePosition(item.id)"
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
export class PositionsComponent implements OnInit {
  readonly store = inject(PositionsStore);

  private dialog = inject(DialogService);
  private ref = inject(DynamicDialogRef);
  public positions = computed(() => [...this.store.entities()]);

  ngOnInit() {
    this.store.fetchItems();
  }

  editPosition(position?: Position) {
    this.ref = this.dialog.open(PositionsFormComponent, {
      header: 'Cargo',
      width: '36rem',
      data: { position },
    });
  }

  deletePosition(id: string) {
    this.store.deleteItem(id);
  }
}
