import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';

import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { DashboardStore } from './dashboard.store';

@Component({
  selector: 'app-dashboard',
  providers: [DashboardStore, MessageService, ConfirmationService],
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ToastModule,
    AccordionModule,
    RippleModule,
    CardModule,
    ConfirmDialogModule,
    Select,
    FormsModule,
    Button,
  ],
  template: `
    <p-toast />
    <p-confirmDialog />
    <nav
      class="bg-white border border-b-slate-200 flex fixed z-30 w-full items-center justify-between px-4 py-3"
    >
      <div class="flex">
        <p-button
          [icon]="!isHandset() ? 'pi pi-bars' : 'pi pi-arrow-left'"
          (click)="toggleMenu()"
          rounded
          text
        />
        <a
          class="font-bold text-slate-600"
          class="flex gap-1 items-center text-lg text-slate-700"
        >
          <img src="images/pt-logo.svg" class="h-8" /> Peopletrak</a
        >
      </div>
      <div class="w-64">
        <div class="input-container">
          <p-select
            [options]="store.companies()"
            [ngModel]="store.selectedCompanyId()"
            (onChange)="toggleCompany($event.value)"
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccione una empresa"
            showClear
          />
        </div>
      </div>
    </nav>
    <div class="flex pt-16 overflow-hidden">
      <aside
        class="fixed py-4  max-h-[calc(100vh-42px)] overflow-y-auto flex flex-col w-64 "
      >
        <ul class="flex flex-col list-none p-2 px-4">
          <li pRipple>
            <a
              routerLink="home"
              class="px-6 flex items-center py-3 rounded-lg w-full hover:bg-slate-100 no-underline text-slate-600"
              routerLinkActive="selected"
            >
              <i class="pi pi-home mr-2"></i>
              Dashboard
            </a>
          </li>
          <li pRipple>
            <a
              routerLink="companies"
              class="px-6 flex items-center py-3 rounded-lg w-full hover:bg-slate-100 no-underline text-slate-600"
              routerLinkActive="selected"
            >
              <i class="pi pi-building mr-2"></i>
              Empresas
            </a>
          </li>
          <li pRipple>
            <a
              routerLink="employees"
              class="px-6 flex items-center py-3 rounded-lg w-full hover:bg-slate-50 no-underline text-slate-600"
              routerLinkActive="selected"
            >
              <i class="pi pi-users mr-2"></i>
              Empleados
            </a>
          </li>
          <li pRipple>
            <a
              routerLink="timelogs"
              class="px-6 flex items-center py-3 rounded-lg w-full hover:bg-slate-50 no-underline text-slate-600"
              routerLinkActive="selected"
            >
              <i class="pi pi-clock mr-2"></i>
              Marcaciones
            </a>
          </li>
          <li>
            <a
              pRipple
              routerLink="positions"
              class="px-6 flex items-center py-3 rounded-lg w-full hover:bg-slate-50 no-underline text-slate-600"
              routerLinkActive="selected"
            >
              <i class="pi pi-user-plus mr-2"></i>
              Cargos
            </a>
          </li>
          <li pRipple>
            <a
              routerLink="branches"
              class="px-6 flex items-center py-3 rounded-lg w-full hover:bg-slate-50 no-underline text-slate-600"
              routerLinkActive="selected"
            >
              <i class="pi pi-shop mr-2"></i>
              Sucursales
            </a>
          </li>
          <li pRipple>
            <a
              routerLink="departments"
              class="px-6 flex items-center py-3 rounded-lg w-full hover:bg-slate-50 no-underline text-slate-600"
              routerLinkActive="selected"
            >
              <i class="pi pi-sitemap mr-2"></i>
              Areas
            </a>
          </li>
          <li pRipple>
            <a
              routerLink="schedules"
              class="px-6 flex items-center py-3 rounded-lg w-full hover:bg-slate-50 no-underline text-slate-600"
              routerLinkActive="selected"
            >
              <i class="pi pi-calendar mr-2"></i>
              Horarios
            </a>
          </li>
          <li pRipple>
            <a
              routerLink="shifts"
              class="px-6 flex items-center py-3 rounded-lg w-full hover:bg-slate-50 no-underline text-slate-600"
              routerLinkActive="selected"
            >
              <i class="pi pi-calendar-clock mr-2"></i>
              Turnos
            </a>
          </li>
          <li>
            <p-accordion expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
              <p-accordion-panel value="0">
                <p-accordion-header>Sucursales</p-accordion-header>
                <p-accordion-content>
                  <ul class="flex flex-col list-none px-2">
                    @for (branch of store.branches(); track branch.id) {
                    <li pRipple>
                      <a
                        class="px-6 flex items-center py-3 rounded-lg w-full hover:bg-slate-50 no-underline text-slate-600"
                        [routerLink]="['branches', branch.id]"
                        >{{ branch.name }}</a
                      >
                    </li>
                    }
                  </ul></p-accordion-content
                >
              </p-accordion-panel>
            </p-accordion>
          </li>
        </ul>
      </aside>
      <main class="overflow-auto relative w-full p-4 h-full ms-64">
        <router-outlet />
      </main>
    </div>
  `,
  styles: `
      .selected {
        @apply bg-indigo-100 text-indigo-500 transition-all duration-300 ease-in-out;
      }

      main {
        min-width: 0;
      }`,
})
export class DashboardComponent {
  public isHandset = signal(false);
  public isCollapsed = signal(true);
  public store = inject(DashboardStore);

  async toggleMenu() {
    if (this.isHandset()) {
      this.isCollapsed.set(false);
      return;
    }

    this.isCollapsed.update((value) => !value);
  }

  toggleCompany(companyId: string | null) {
    this.store.toggleCompany(companyId);
  }
}
