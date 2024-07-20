import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';

import { AgePipe } from '../../pipes/age.pipe';
import { DashboardStore } from '../dashboard.store';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { TerminationFormComponent } from '../termination-form/termination-form.component';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    CardModule,
    SplitButtonModule,
    DatePipe,
    CurrencyPipe,
    MenuModule,
    ButtonModule,
    AgePipe,
  ],
  providers: [DynamicDialogRef, DialogService],
  template: `
    <div class="mx-8 md:mx-12 flex flex-col gap-2">
      <div class="flex w-full justify-between items-center">
        <h2>
          Datos del empleado: {{ employee()?.first_name }}
          {{ employee()?.father_name }}
        </h2>
        @if (employee()) {
        <p-menu #menu [model]="items" [popup]="true" />
        <p-button
          label="Acciones"
          icon="pi pi-ellipsis-v"
          (onClick)="menu.toggle($event)"
        />
        }
      </div>

      <p-card class="mb-4" header="Datos Personales">
        <div class="flex flex-col md:grid md:grid-cols-4 gap-4">
          <div>
            <p class="label">Primer nombre</p>
            <p class="info">{{ employee()?.first_name }}</p>
          </div>
          <div>
            <p class="label">Segundo nombre</p>
            <p class="info">{{ employee()?.middle_name }}</p>
          </div>
          <div>
            <p class="label">Apellido</p>
            <p class="info">{{ employee()?.father_name }}</p>
          </div>
          <div>
            <p class="label">Segundo apellido</p>
            <p class="info">{{ employee()?.mother_name }}</p>
          </div>
          <div>
            <p class="label">Fecha de nacimiento</p>
            <p class="info">
              {{ employee()?.birth_date | date : 'mediumDate' }} ({{
                employee()?.birth_date | age
              }})
            </p>
          </div>
          <div>
            <p class="label">Direccion</p>
            <p class="info">
              {{ employee()?.address }}
            </p>
          </div>
          <div>
            <p class="label">Email</p>
            <p class="info">
              {{ employee()?.email }}
            </p>
          </div>
          <div>
            <p class="label">Nro. Telefono</p>
            <p class="info">
              {{ employee()?.phone_number }}
            </p>
          </div>
        </div>
      </p-card>
      <p-card header="Datos laborales">
        <div class="flex flex-col md:grid md:grid-cols-4 gap-4">
          <div>
            <p class="label">Fecha de Ingreso</p>
            <p class="info">
              {{ employee()?.start_date | date : 'mediumDate' }}
            </p>
          </div>
          <div>
            <p class="label">Departamento</p>
            <p class="info">
              {{ employee()?.department?.name }}
            </p>
          </div>
          <div>
            <p class="label">Sucursal</p>
            <p class="info">
              {{ employee()?.branch?.name }}
            </p>
          </div>
          <div>
            <p class="label">Cargo</p>
            <p class="info">
              {{ employee()?.position?.name }}
            </p>
          </div>
          <div>
            <p class="label">Salario</p>
            <p class="info">
              {{ employee()?.monthly_salary | currency : '$' }}
            </p>
          </div>
          <div>
            <p class="label">Talla</p>
            <p class="info">
              {{ employee()?.uniform_size }}
            </p>
          </div>
        </div>
      </p-card>
    </div>
  `,
  styles: `
      p {
        margin-bottom: 0 !important;
      }

      .label {
        @apply text-indigo-400 text-sm;
      }
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailComponent {
  public state = inject(DashboardStore);
  public id = input.required<string>();
  public employee = computed(() =>
    this.state.employees().find((x) => x.id === this.id())
  );
  items: MenuItem[] = [
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      command: () => {
        this.editEmployee();
      },
    },
    {
      label: 'Salida',
      icon: 'pi pi-undo',
      command: () => {
        this.terminateEmployee();
      },
    },
    {
      label: 'Eliminar',
      icon: 'pi pi-trash',
      command: () => {
        this.deleteEmployee();
      },
    },
  ];
  private dialog = inject(DialogService);
  private ref = inject(DynamicDialogRef);

  editEmployee() {
    this.ref = this.dialog.open(EmployeeFormComponent, {
      header: 'Datos de empleado',
      width: '90vw',
      data: { employee: this.employee() },
    });
  }

  terminateEmployee() {
    this.ref = this.dialog.open(TerminationFormComponent, {
      data: { employee: this.employee() },
      width: '50vw',
      header: 'Terminacion de empleado',
    });
  }

  deleteEmployee() {
    this.state.deleteEmployee(this.employee()!.id);
  }
}
