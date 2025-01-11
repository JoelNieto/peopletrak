import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Schedule } from '../models';
import { TimePipe } from '../pipes/time.pipe';
import { DashboardStore } from './dashboard.store';
import { SchedulesFormComponent } from './schedules-form.component';

@Component({
  selector: 'app-schedules',
  imports: [Card, TableModule, Button, TimePipe],
  providers: [DynamicDialogRef, DialogService],
  template: `<p-card>
    <ng-template #title>Horarios</ng-template>
    <ng-template #subtitle>Listado de horarios disponibles</ng-template>
    <div class="flex w-full justify-end">
      <p-button
        label="Agregar"
        icon="pi pi-plus-circle"
        (onClick)="editSchedule()"
      />
    </div>
    <p-table
      [value]="schedules()"
      [rows]="5"
      [rowsPerPageOptions]="[5, 10, 20]"
      sortField="entry_time"
    >
      <ng-template #header>
        <tr>
          <th pSortableColumn="name">Nombre<p-sortIcon field="name" /></th>
          <th pSortableColumn="entry_time">
            Inicio<p-sortIcon field="entry_time" />
          </th>
          <th pSortableColumn="lunch_start_time">
            Inicio de almuerzo<p-sortIcon field="lunch_start_time" />
          </th>
          <th pSortableColumn="lunch_end_time">
            Fin de almuerzo<p-sortIcon field="lunch_end_time" />
          </th>
          <th pSortableColumn="exit_time">
            Fin<p-sortIcon field="exit_time" />
          </th>
          <th pSortableColumn="minutes_tolerance">
            Tolerancia<p-sortIcon field="minutes_tolerance" />
          </th>
          <th></th>
        </tr>
      </ng-template>
      <ng-template #body let-schedule>
        <tr>
          <td>{{ schedule.name }}</td>
          <td>{{ schedule.entry_time | time }}</td>
          <td>{{ schedule.lunch_start_time | time }}</td>
          <td>{{ schedule.lunch_end_time | time }}</td>
          <td>{{ schedule.exit_time | time }}</td>
          <td>{{ schedule.minutes_tolerance }} min.</td>
          <td>
            <div class="flex gap-2 items-center">
              <p-button
                severity="success"
                icon="pi pi-pen-to-square"
                outlined
                text
                rounded
                (onClick)="editSchedule(schedule)"
              />
              <p-button
                severity="danger"
                icon="pi pi-trash"
                text
                outlined
                rounded
              />
            </div>
          </td>
        </tr>
      </ng-template>
    </p-table>
  </p-card>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulesComponent {
  public store = inject(DashboardStore);
  public schedules = computed(() => [...this.store.schedules()]);

  public dialogService = inject(DialogService);
  private ref = inject(DynamicDialogRef);

  editSchedule(schedule?: Schedule) {
    this.ref = this.dialogService.open(SchedulesFormComponent, {
      header: 'Editar horario',
      data: {
        schedule,
      },
    });
  }
}
