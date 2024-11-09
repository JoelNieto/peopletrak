import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { FilterService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { from, map } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';
import { DashboardStore } from './dashboard.store';
import { TimestampsFormComponent } from './timestamps-form.component';

@Component({
  selector: 'app-timestamps',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    TableModule,
    DatePipe,
    CalendarModule,
    MultiSelectModule,
    FormsModule,
  ],
  providers: [DialogService],
  template: `<p-card
    header="Marcaciones"
    subheader="Listado de marcaciones de reloj de empleados "
    class="w-full"
  >
    <div class="flex flex-col gap-3">
      <div class="flex justify-between">
        <p-calendar placeholder="Fecha" selectionMode="range" appendTo="body" />
      </div>
      <p-table
        [value]="timestamps() ?? []"
        [paginator]="true"
        [rows]="5"
        [rowsPerPageOptions]="[5, 10]"
      >
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="employee.first_name">
              Empleado <p-sortIcon field="employee" />
            </th>
            <th pSortableColumn="branch.name">
              Sucursal <p-sortIcon field="branch" />
            </th>
            <th pSortableColumn="created_at">
              Fecha <p-sortIcon field="created_at" />
            </th>
            <th>Hora</th>
            <th>Acciones</th>
          </tr>
          <tr>
            <th>
              <p-columnFilter
                field="employee"
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
                    [options]="state.employees()"
                    placeholder="TODOS"
                    (onChange)="filter($event.value)"
                    appendTo="body"
                    filterBy="first_name,father_name"
                  >
                    <ng-template pTemplate="selectedItems" let-items>
                      @for(selected of items; track selected.id) {
                      {{ selected.first_name }} {{ selected.father_name }}, }
                      @if(!items || items.length === 0) { TODOS }
                    </ng-template>
                    <ng-template let-item pTemplate="item">
                      {{ item.first_name }} {{ item.father_name }}
                    </ng-template>
                  </p-multiSelect>
                </ng-template>
              </p-columnFilter>
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
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-timestamp>
          <tr>
            <td>
              {{ timestamp.employee.first_name }}
              {{ timestamp.employee.father_name }}
            </td>
            <td>{{ timestamp.branch.name }}</td>
            <td>{{ timestamp.created_at | date : 'dd/MM/yyyy' }}</td>
            <td>{{ timestamp.created_at | date : 'hh:mm:ss a' }}</td>
            <td>
              <div class="flex gap-2">
                <p-button
                  icon="pi pi-pencil"
                  severity="success"
                  rounded
                  text
                  outlined
                  (onClick)="editTimestamp(timestamp)"
                />
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  rounded
                  text
                  outlined
                />
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  </p-card>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimestampsComponent implements OnInit {
  public supabase = inject(SupabaseService);
  public state = inject(DashboardStore);
  private filterService = inject(FilterService);
  private dialog = inject(DialogService);
  public timestamps = toSignal(
    from(
      this.supabase.client
        .from('timestamps')
        .select('*, employee:employees(*), branch:branches(*)')
    ).pipe(map((response) => response.data)),
    { initialValue: [] }
  );

  public employees = toSignal(
    from(
      this.supabase.client
        .from('employees')
        .select('*')
        .order('father_name')
        .eq('is_active', true)
    ).pipe(map((response) => response.data)),
    {
      initialValue: [],
    }
  );

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

  editTimestamp(timestamp?: any) {
    this.dialog.open(TimestampsFormComponent, {
      width: '36rem',
      data: { timestamp },
      header: 'Marcación',
    });
  }
}
