import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DashboardStore } from '../dashboard.store';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [MatCardModule, DatePipe],
  template: `
    <div class="mx-8 md:mx-12">
      <h2 class="mat-headline-medium">Datos del empleado</h2>
      <mat-card>
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
                {{ employee()?.birth_date | date : 'mediumDate' }}
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
    </div>
  `,
  styles: `
      p {
        margin-bottom: 0 !important;
      }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailComponent implements OnInit {
  public state = inject(DashboardStore);
  public id = input.required<string>();
  public employee = computed(() =>
    this.state.employees().find((x) => x.id === this.id())
  );

  ngOnInit() {
    console.log(this.employee());
  }
}
