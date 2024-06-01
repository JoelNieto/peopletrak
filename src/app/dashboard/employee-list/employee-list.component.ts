import { DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Employee } from '../../models';
import { DashboardStore } from '../dashboard.store';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIcon,
    MatMenuModule,
    DecimalPipe,
  ],
  template: `
    <div class="w-full flex justify-between items-center">
      <h1 class="mat-headline-medium">Listado de empleados</h1>
      <button mat-flat-button (click)="editEmployee()">Nuevo</button>
    </div>

    <div class="w-full flex gap-4">
      <mat-form-field>
        <mat-label>Sucursal</mat-label>
        <mat-select>
          @for (branch of state.branches(); track branch.id) {
          <mat-option [value]="branch.id">{{ branch.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Area</mat-label>
        <mat-select>
          @for (department of state.departments(); track department.id) {
          <mat-option [value]="department.id">{{ department.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Cargo</mat-label>
        <mat-select>
          @for (position of state.positions(); track position.id) {
          <mat-option [value]="position.id">{{ position.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </div>
    <table mat-table [dataSource]="dataSource" matSort>
      <ng-container matColumnDef="name" sticky>
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
        <td mat-cell *matCellDef="let item">
          {{ item.first_name }} {{ item.father_name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="document">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Cedula</th>
        <td mat-cell *matCellDef="let item">
          {{ item.document_id }}
        </td>
      </ng-container>
      <ng-container matColumnDef="branch">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Sucursal</th>
        <td mat-cell *matCellDef="let item">
          {{ item.branch.name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="department">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Area</th>
        <td mat-cell *matCellDef="let item">
          {{ item.department.name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="position">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Cargo</th>
        <td mat-cell *matCellDef="let item">
          {{ item.position.name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="salary">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Salario</th>
        <td mat-cell *matCellDef="let item">
          {{ item.monthly_salary | number : '2.2' }}
        </td>
      </ng-container>
      <ng-container matColumnDef="actions" sticky>
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let item">
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="editEmployee(item)">Editar</button>
            <button mat-menu-item>Borrar</button>
          </mat-menu>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeListComponent implements AfterViewInit {
  readonly state = inject(DashboardStore);
  public sort = viewChild.required(MatSort);
  displayedColumns = [
    'name',
    'document',
    'branch',
    'department',
    'position',
    'salary',
    'actions',
  ];
  public dataSource = new MatTableDataSource<Employee>([]);
  private dialog = inject(MatDialog);
  private viewRef = inject(ViewContainerRef);
  private injector = inject(Injector);

  editEmployee(employee?: Employee) {
    this.dialog.open(EmployeeFormComponent, {
      width: '90vw',
      viewContainerRef: this.viewRef,
      data: { employee },
    });
  }

  ngAfterViewInit() {
    effect(
      () => {
        this.dataSource.data = this.state.employees();
        this.dataSource.sort = this.sort();
      },
      { injector: this.injector }
    );
  }
}
