import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DashboardStore } from '../stores/dashboard.store';

@Component({
  selector: 'pt-time-management',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `<header class="bg-white shadow-sm">
      <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div class="block w-full overflow-scroll">
          <div class="flex gap-4">
            @if (store.isAdmin()) {
            <a
              routerLink="timelogs"
              class="flex gap-2 items-center rounded-full font-semibold text-gray-700 hover:bg-gray-200 px-4 py-2"
              [routerLinkActive]="[
                'bg-primary-100',
                'hover:bg-primary-100',
                'text-primary-900'
              ]"
              ><i class="pi pi-clock"></i> Marcaciones</a
            >
            }

            <a
              routerLink="timetables"
              class="flex gap-2 items-center rounded-full font-semibold text-gray-700 hover:bg-gray-200 px-4 py-2"
              [routerLinkActive]="[
                'bg-primary-100',
                'hover:bg-primary-100',
                'text-primary-900'
              ]"
              ><i class="pi pi-calendar-clock"></i> Turnos</a
            >
            @if(store.isAdmin()) {
            <a
              routerLink="schedules"
              class="flex gap-2 items-center rounded-full font-semibold text-gray-700 hover:bg-gray-200 px-4 py-2"
              [routerLinkActive]="[
                'bg-primary-100',
                'hover:bg-primary-100',
                'text-primary-900'
              ]"
              ><i class="pi pi-calendar"></i> Horarios</a
            >
            }
          </div>
        </div>
      </div>
    </header>
    <main>
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <router-outlet />
      </div>
    </main>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeManagementComponent {
  public store = inject(DashboardStore);
}
