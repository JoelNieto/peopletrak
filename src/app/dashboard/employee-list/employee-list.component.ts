import { DatePipe, DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs';
import { DeleteConfirmationComponent } from '../../delete-confirmation.component';
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
    DatePipe,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressBar,
    RouterLink,
  ],
  template: `
    <div class="w-full flex justify-between items-center">
      <h1 class="mat-headline-medium">Listado de empleados</h1>
      <button mat-flat-button (click)="editEmployee()">Nuevo</button>
    </div>

    <div class="w-full flex flex-col md:flex-row gap:2 md:gap-4">
      <mat-form-field>
        <mat-label>Buscar</mat-label>
        <mat-icon matPrefix>search</mat-icon>
        <input
          type="text"
          id="table-search"
          matInput
          [formControl]="searchControlText"
          placeholder="Introduzca filtro"
        />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Sucursal</mat-label>
        <mat-select [formControl]="branchControl">
          <mat-option>Todos</mat-option>
          @for (branch of state.branches(); track branch.id) {
          <mat-option [value]="branch.id">{{ branch.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Area</mat-label>
        <mat-select [formControl]="departmentControl">
          <mat-option>Todos</mat-option>
          @for (department of state.departments(); track department.id) {
          <mat-option [value]="department.id">{{ department.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Cargo</mat-label>
        <mat-select [formControl]="positionControl">
          <mat-option>Todos</mat-option>
          @for (position of state.positions(); track position.id) {
          <mat-option [value]="position.id">{{ position.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </div>
    <div class="table-container">
      @if (state.loading()) {
      <mat-progress-bar mode="query" color="primary" />
      }
      <table mat-table [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="first_name" sticky>
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
          <td mat-cell *matCellDef="let item">
            {{ item.first_name }} {{ item.father_name }}
          </td>
        </ng-container>
        <ng-container matColumnDef="document_id">
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
        <ng-container matColumnDef="monthly_salary">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Salario</th>
          <td mat-cell *matCellDef="let item">
            {{ item.monthly_salary | number : '2.2' }}
          </td>
        </ng-container>
        <ng-container matColumnDef="start_date">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            Fecha inicio
          </th>
          <td mat-cell *matCellDef="let item">
            {{ item.start_date | date : 'mediumDate' }}
          </td>
        </ng-container>
        <ng-container matColumnDef="gender">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Sexo</th>
          <td mat-cell *matCellDef="let item">
            {{ item.gender }}
          </td>
        </ng-container>
        <ng-container matColumnDef="actions" stickyEnd>
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let item">
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <a mat-menu-item [routerLink]="item.id">Detalles</a>
              <button mat-menu-item (click)="editEmployee(item)">Editar</button>
              <button mat-menu-item (click)="deleteEmployee(item.id)">
                Borrar
              </button>
            </mat-menu>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </div>
    <mat-paginator
      [pageSize]="10"
      [pageSizeOptions]="[5, 10, 25]"
      aria-label="Select page"
    >
    </mat-paginator>
  `,
  styles: `
      .table-container {
        overflow: auto;
      }
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeListComponent implements AfterViewInit {
  readonly state = inject(DashboardStore);
  public sort = viewChild.required(MatSort);
  public paginator = viewChild.required(MatPaginator);

  displayedColumns = [
    'first_name',
    'document_id',
    'branch',
    'department',
    'position',
    'monthly_salary',
    'start_date',
    'gender',
    'actions',
  ];
  public searchControlText = new FormControl('', { nonNullable: true });
  public branchControl = new FormControl('', { nonNullable: true });
  public departmentControl = new FormControl('', { nonNullable: true });
  public positionControl = new FormControl('', { nonNullable: true });
  public searchValue = toSignal(
    this.searchControlText.valueChanges.pipe(debounceTime(500)),
    { initialValue: '' }
  );
  public branchValue = toSignal(
    this.branchControl.valueChanges.pipe(debounceTime(500)),
    { initialValue: '' }
  );
  public departmentValue = toSignal(
    this.departmentControl.valueChanges.pipe(debounceTime(500)),
    { initialValue: '' }
  );
  public positionValue = toSignal(
    this.positionControl.valueChanges.pipe(debounceTime(500)),
    { initialValue: '' }
  );
  public dataSource = new MatTableDataSource<Employee>([]);

  public filtered = computed(() =>
    this.state
      .employees()
      .filter((item) =>
        this.branchValue() ? item.branch?.id === this.branchValue() : true
      )
      .filter((item) =>
        this.departmentValue()
          ? item.department?.id === this.departmentValue()
          : true
      )
      .filter((item) =>
        this.positionValue() ? item.position?.id === this.positionValue() : true
      )
      .filter(
        (item) =>
          item.first_name
            .toLowerCase()
            .includes(this.searchValue().toLowerCase()) ||
          item.father_name
            .toLowerCase()
            .includes(this.searchValue().toLowerCase()) ||
          item.document_id
            .toLowerCase()
            .includes(this.searchValue().toLowerCase())
      )
  );
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
        this.dataSource.data = this.filtered();
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'position':
              return item.position?.id;
            case 'branch':
              return item.branch?.name;
            case 'department':
              return item.department?.name;
            default: // @ts-ignore
              return item[property];
          }
        };
        this.dataSource.sort = this.sort();
        this.dataSource.paginator = this.paginator();
      },
      { injector: this.injector }
    );
  }

  deleteEmployee(id: string) {
    this.dialog
      .open(DeleteConfirmationComponent, {
        width: '20vw',
        viewContainerRef: this.viewRef,
      })
      .afterClosed()
      .subscribe({
        next: async (res) => {
          if (res) {
            await this.state.deleteEmployee(id);
          }
        },
      });
  }
}

git;
