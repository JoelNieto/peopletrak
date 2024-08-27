import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';

import { DashboardStore } from './dashboard.store';

@Component({
  selector: 'app-dashboard',
  template: `
    <p-toast />
    <p-confirmDialog />
    <div class="flex">
      <div
        class="fixed h-screen transition-all  duration-300 z-10 w-64 border-r border-slate-200"
      >
        <div class="flex gap-4 items-center">
          <p-button [text]="true" icon="pi pi-bars" (click)="toggleMenu()" />

          <a class="font-bold text-slate-600">Peopletrak</a>
        </div>
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
              routerLink="employees"
              class="px-6 flex items-center py-3 rounded-lg w-full hover:bg-slate-50 no-underline text-slate-600"
              routerLinkActive="selected"
            >
              <i class="pi pi-users mr-2"></i>
              Empleados
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

          <li>
            <p-accordion expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
              <p-accordionTab header="SUCURSALES">
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
                </ul>
              </p-accordionTab>
            </p-accordion>
          </li>
        </ul>
      </div>

      <main class="px-8 py-4 flex-1 ml-64">
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
  standalone: true,
  providers: [DashboardStore, MessageService, ConfirmationService],
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgClass,
    ToastModule,
    AccordionModule,
    RippleModule,
    CardModule,
    ConfirmDialogModule,
  ],
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
}
