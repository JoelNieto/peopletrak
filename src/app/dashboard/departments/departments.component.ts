import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Department } from '../../models';
import { DashboardStore } from '../dashboard.store';
import { DepartmentsFormComponent } from '../departments-form/departments-form.component';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [TableModule, ButtonModule, CardModule],
  providers: [DynamicDialogRef, DialogService],
  template: `
    <p-card
      header="Areas"
      subheader="Listado de areas/departamentos de la empresa"
    >
      <div class="w-full flex justify-end">
        <p-button (click)="editDepartment()" label="Agregar" />
      </div>
      <div>
        <p-table
          [value]="state.departments()"
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
              <th></th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr>
              <td>{{ item.name }}</td>
              <td>
                <p-button
                  severity="success"
                  [text]="true"
                  [rounded]="true"
                  icon="pi pi-pen-to-square"
                  (click)="editDepartment(item)"
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
      </div>
    </p-card>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentsComponent {
  readonly state = inject(DashboardStore);
  private ref = inject(DynamicDialogRef);
  private dialog = inject(DialogService);

  editDepartment(department?: Department) {
    this.ref = this.dialog.open(DepartmentsFormComponent, {
      header: 'Area',
      width: '36rem',
      data: { department },
    });
  }
}
