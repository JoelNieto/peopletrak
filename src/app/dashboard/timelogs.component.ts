import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DashboardStore } from './dashboard.store';

@Component({
  selector: 'app-timelogs',
  standalone: true,
  imports: [CardModule, DropdownModule, CalendarModule, FormsModule, JsonPipe],
  template: `<p-card
    header="Timelogs"
    subheader="Listado de marcaciones de empleados"
  >
    <div class="flex gap-3">
      <div class="input-container">
        <p-dropdown
          [options]="store.branches()"
          optionLabel="name"
          optionValue="id"
          placeholder="Seleccione una sucursal"
          filter
          appendTo="body"
        />
      </div>
      <div class="input-container">
        <p-dropdown
          [options]="store.employeesList()"
          optionLabel="short_name"
          optionValue="id"
          placeholder="Seleccione un empleado"
          filter
          appendTo="body"
        />
      </div>
      <div class="input-container">
        <p-calendar
          placeholder="Fecha"
          selectionMode="range"
          appendTo="body"
          [(ngModel)]="dateRange"
        />
      </div>
    </div>
    {{ dateRange() | json }}
  </p-card>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelogsComponent {
  public store = inject(DashboardStore);
  public dateRange = model<Date[]>();
}
