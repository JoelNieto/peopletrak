import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AgePipe } from '../../pipes/age.pipe';
import { DashboardStore } from '../dashboard.store';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [MatCardModule, DatePipe, CurrencyPipe, AgePipe],
  template: `
    <div class="mx-8 md:mx-12">
      <h2 class="mat-display-medium">
        Datos del empleado: {{ employee()?.first_name }}
        {{ employee()?.father_name }}
      </h2>
      <mat-card class="mb-4">
        <mat-card-header>
          <mat-card-title>Datos personales</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="flex flex-col md:grid md:grid-cols-4 gap-4">
            <div>
              <p class="mat-label">Primer nombre</p>
              <p class="mat-body">{{ employee()?.first_name }}</p>
            </div>
            <div>
              <p class="mat-label">Segundo nombre</p>
              <p class="mat-body">{{ employee()?.middle_name }}</p>
            </div>
            <div>
              <p class="mat-label">Apellido</p>
              <p class="mat-body">{{ employee()?.father_name }}</p>
            </div>
            <div>
              <p class="mat-label">Segundo apellido</p>
              <p class="mat-body">{{ employee()?.mother_name }}</p>
            </div>
            <div>
              <p class="mat-label">Fecha de nacimiento</p>
              <p class="mat-body">
                {{ employee()?.birth_date | date : 'mediumDate' }} ({{
                  employee()?.birth_date | age
                }})
              </p>
            </div>
            <div>
              <p class="mat-label">Direccion</p>
              <p class="mat-body">
                {{ employee()?.address }}
              </p>
            </div>
            <div>
              <p class="mat-label">Email</p>
              <p class="mat-body">
                {{ employee()?.email }}
              </p>
            </div>
            <div>
              <p class="mat-label">Nro. Telefono</p>
              <p class="mat-body">
                {{ employee()?.phone_number }}
              </p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-header>
          <mat-card-title> Datos laborales</mat-card-title>
        </mat-card-header>
        <mat-card-content class="flex flex-col md:grid md:grid-cols-4 gap-4">
          <div>
            <p class="mat-label">Fecha de Ingreso</p>
            <p class="mat-body">
              {{ employee()?.start_date | date : 'mediumDate' }}
            </p>
          </div>
          <div>
            <p class="mat-label">Departamento</p>
            <p class="mat-body">
              {{ employee()?.department?.name }}
            </p>
          </div>
          <div>
            <p class="mat-label">Sucursal</p>
            <p class="mat-body">
              {{ employee()?.branch?.name }}
            </p>
          </div>
          <div>
            <p class="mat-label">Cargo</p>
            <p class="mat-body">
              {{ employee()?.position?.name }}
            </p>
          </div>
          <div>
            <p class="mat-label">Salario</p>
            <p class="mat-body">
              {{ employee()?.monthly_salary | currency : 'PAB' }}
            </p>
          </div>
          <div>
            <p class="mat-label">Talla</p>
            <p class="mat-body">
              {{ employee()?.uniform_size }}
            </p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
      p {
        margin-bottom: 0 !important;
      }

      .mat-label {
        color: var(--mat-text-button-state-layer-color);
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
}
