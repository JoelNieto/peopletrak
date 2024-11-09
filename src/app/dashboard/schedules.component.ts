import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Schedule } from '../models';
import { TimePipe } from '../pipes/time.pipe';
import { DashboardStore } from './dashboard.store';
import { SchedulesFormComponent } from './schedules-form.component';

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [CardModule, TableModule, ButtonModule, TimePipe],
  providers: [DynamicDialogRef, DialogService],
  template: `<p-card
    header="Horarios"
    subheader="Listado de horarios disponibles"
  >
    <div class="flex w-full justify-end">
      <p-button
        label="Agregar"
        icon="pi pi-plus-circle"
        (onClick)="editSchedule()"
      />
    </div>
    <p-table
      [value]="store.schedules()"
      [rows]="5"
      [rowsPerPageOptions]="[5, 10, 20]"
    >
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="name">Nombre<p-sortIcon field="name" /></th>
          <th pSortableColumn="start">Inicio<p-sortIcon field="start" /></th>
          <th pSortableColumn="lunch_start_time">
            Inicio de almuerzo<p-sortIcon field="lunch_start_time" />
          </th>
          <th pSortableColumn="lunch_end_time">
            Fin de almuerzo<p-sortIcon field="lunch_end_time" />
          </th>
          <th pSortableColumn="end">Fin<p-sortIcon field="end" /></th>
          <th pSortableColumn="minutes_tolerance">
            Tolerancia<p-sortIcon field="minutes_tolerance" />
          </th>
          <th></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-schedule>
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
