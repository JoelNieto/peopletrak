import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FilterService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { debounceTime } from 'rxjs';

import { Employee } from '../../models';
import { AgePipe } from '../../pipes/age.pipe';
import { DashboardStore } from '../dashboard.store';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    DecimalPipe,
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    AgePipe,
    CurrencyPipe,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    InputSwitchModule,
    ProgressBarModule,
    TableModule,
    MenuModule,
    CardModule,
    TagModule,
    FormsModule,
    MultiSelectModule,
  ],
  providers: [DynamicDialogRef, DialogService],
  template: `
    <p-card
      header="Empleados"
      subheader="Listado de colaboradores de la empresa"
    >
      <div class="w-full flex justify-end items-center">
        <p-button
          label="Nuevo"
          (click)="editEmployee()"
          icon="pi pi-plus-circle"
        />
      </div>
      <section class="pt-2 flex items-center gap-2">
        <p-inputSwitch [formControl]="inactiveToggle" inputId="active" />
        <label for="active">Incluir inactivos</label>
      </section>
      @if (state.loading()) {
      <p-progressBar mode="indeterminate" [style]="{ height: '6px' }" />
      }
      <p-table
        [value]="this.filtered()"
        [paginator]="true"
        [rows]="5"
        [rowsPerPageOptions]="[5, 10, 20]"
        [scrollable]="true"
        dataKey="id"
      >
        <ng-template pTemplate="header">
          <tr>
            <th style="width:22%" pFrozenColumn pSortableColumn="full_name">
              Nombre<p-sortIcon field="first_name" />
            </th>
            @if (inactiveValue()) {
            <th pSortableColumn="is_active">
              Status
              <p-sortIcon field="is_active" />
            </th>
            }
            <th pSortableColumn="document_id">
              Cedula<p-sortIcon field="document_id" />
            </th>
            <th pSortableColumn="branch.name">
              Sucursal <p-sortIcon field="branch" />
            </th>
            <th pSortableColumn="department.name">
              Area <p-sortIcon field="department" />
            </th>
            <th pSortableColumn="position.name">
              Cargo <p-sortIcon field="position" />
            </th>
            <th pSortableColumn="monthly_salary">
              Salario <p-sortIcon field="salary" />
            </th>
            <th pSortableColumn="uniform_size">
              Talla <p-sortIcon field="size" />
            </th>
            <th pSortableColumn="start_date">
              Fecha de inicio <p-sortIcon field="start_date" />
            </th>
            <th pSortableColumn="probatory">
              Probatorio <p-sortIcon field="probatory" />
            </th>
            <th pSortableColumn="birth_date">
              Fecha de nacimiento <p-sortIcon field="birth_date" />
            </th>
            <th>Sexo</th>
            <th pSortableColumn="created_at">
              Creado <p-sortIcon field="created_at" />
            </th>
            <th pFrozenColumn alignFrozen="right"></th>
          </tr>
          <tr>
            <th pFrozenColumn>
              <p-columnFilter
                type="text"
                field="full_name"
                placeholder="Buscar por nombre"
                ariaLabel="Filter Name"
              />
            </th>
            @if (inactiveValue()) {
            <th></th>
            }
            <th>
              <p-columnFilter
                type="text"
                field="document_id"
                placeholder="Buscar por Nro. Doc"
                ariaLabel="Filter Document"
              />
            </th>
            <th>
              <p-columnFilter
                field="branch"
                matchMode="custom-filter"
                [showMenu]="false"
              >
                <ng-template
                  pTemplate="filter"
                  let-value
                  let-filter="filterCallback"
                >
                  <p-multiSelect
                    [ngModel]="value"
                    [options]="state.branches()"
                    placeholder="TODOS"
                    (onChange)="filter($event.value)"
                    optionLabel="name"
                    appendTo="body"
                  />
                </ng-template>
              </p-columnFilter>
            </th>
            <th>
              <p-columnFilter
                field="department"
                matchMode="custom-filter"
                [showMenu]="false"
              >
                <ng-template
                  pTemplate="filter"
                  let-value
                  let-filter="filterCallback"
                >
                  <p-multiSelect
                    [ngModel]="value"
                    [options]="state.departments()"
                    placeholder="TODOS"
                    (onChange)="filter($event.value)"
                    optionLabel="name"
                    appendTo="body"
                  />
                </ng-template>
              </p-columnFilter>
            </th>
            <th>
              <p-columnFilter
                field="position"
                matchMode="custom-filter"
                [showMenu]="false"
              >
                <ng-template
                  pTemplate="filter"
                  let-value
                  let-filter="filterCallback"
                >
                  <p-multiSelect
                    [ngModel]="value"
                    [options]="state.positions()"
                    placeholder="TODOS"
                    (onChange)="filter($event.value)"
                    optionLabel="name"
                    appendTo="body"
                  />
                </ng-template>
              </p-columnFilter>
            </th>
            <th></th>
            <th></th>
            <th></th>
            <th>
              <p-columnFilter
                field="probatory"
                matchMode="equals"
                [showMatchModes]="false"
                [showOperator]="false"
                [showAddButton]="false"
                [showApplyButton]="false"
                [showClearButton]="false"
              >
                <ng-template
                  pTemplate="filter"
                  let-value
                  let-filter="filterCallback"
                >
                  <p-dropdown
                    [options]="probatories"
                    [ngModel]="value"
                    (onChange)="filter($event.value)"
                    placeholder="Elija uno"
                    [showClear]="true"
                  >
                    <ng-template let-option pTemplate="item">
                      <p-tag
                        [value]="option.value ? 'PROBATORIO' : 'NORMAL'"
                        [severity]="option.value ? 'danger' : 'secondary'"
                      />
                    </ng-template>
                  </p-dropdown>
                </ng-template>
              </p-columnFilter>
            </th>
            <th></th>
            <th></th>
            <th></th>
            <th pFrozenColumn alignFrozen="right"></th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-item>
          <tr>
            <td pFrozenColumn>{{ item.first_name }} {{ item.father_name }}</td>
            @if (inactiveValue()) {
            <td>
              <p-tag
                [severity]="item.is_active ? 'success' : 'danger'"
                [value]="item.is_active ? 'ACTIVO' : 'INACTIVO'"
              />
            </td>

            }
            <td>{{ item.document_id }}</td>
            <td>{{ item.branch.name }}</td>
            <td>{{ item.department.name }}</td>
            <td>{{ item.position.name }}</td>
            <td>{{ item.monthly_salary | currency : '$' }}</td>
            <td>{{ item.uniform_size }}</td>
            <td>{{ item.start_date | date : 'mediumDate' }}</td>
            <td>
              @if (item.probatory) {
              <p-tag severity="danger" value="PROBATORIO" />
              }
            </td>
            <td>
              {{ item.birth_date | date : 'mediumDate' }} ({{
                item.birth_date | age
              }})
            </td>
            <td>{{ item.gender }}</td>
            <td>{{ item.created_at | date : 'medium' }}</td>
            <td pFrozenColumn alignFrozen="right">
              <p-button
                icon="pi pi-info-circle"
                [routerLink]="item.id"
                [rounded]="true"
                [text]="true"
              />
              <p-button
                icon="pi pi-pen-to-square"
                (click)="editEmployee(item)"
                [rounded]="true"
                [text]="true"
                severity="success"
              />
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `,
  styles: `
    
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeListComponent implements OnInit {
  readonly state = inject(DashboardStore);
  public searchControlText = new FormControl('', { nonNullable: true });
  public branchControl = new FormControl('', { nonNullable: true });
  public departmentControl = new FormControl('', { nonNullable: true });
  public positionControl = new FormControl('', { nonNullable: true });
  public inactiveToggle = new FormControl(false, { nonNullable: true });
  public probatories = [
    { label: 'Probatorio', value: true },
    { label: 'Regular', value: false },
  ];
  public searchValue = toSignal(
    this.searchControlText.valueChanges.pipe(debounceTime(500)),
    { initialValue: '' }
  );

  public inactiveValue = toSignal(this.inactiveToggle.valueChanges, {
    initialValue: false,
  });

  public filtered = computed(() =>
    this.state
      .employeesList()
      .filter(
        (item) =>
          item.is_active === (this.inactiveValue() ? item.is_active : true)
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
  private dialog = inject(DialogService);
  private ref = inject(DynamicDialogRef);
  private filterService = inject(FilterService);
  callbackFilter: any;

  ngOnInit(): void {
    this.filterService.register(
      'custom-filter',
      (value: { id: any } | null | undefined, filter: any[]) => {
        if (filter === undefined || filter === null || !filter.length) {
          return true;
        }

        if (value === undefined || value === null) {
          return false;
        }

        return filter.map((x) => x.id).includes(value.id);
      }
    );
  }

  editEmployee(employee?: Employee) {
    this.ref = this.dialog.open(EmployeeFormComponent, {
      header: 'Datos de empleado',
      width: '90vw',
      data: { employee },
    });
  }
}
