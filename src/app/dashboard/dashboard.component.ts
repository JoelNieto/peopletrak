import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DashboardStore } from './dashboard.store';

@Component({
  selector: 'app-dashboard',
  template: `
    <mat-sidenav-container autosize class="h-screen">
      <mat-sidenav
        fixedInViewport
        [attr.role]="role()"
        [mode]="mode()"
        [opened]="!isHandset()"
        class="w-24 p-4"
      >
        <div class="flex flex-col">
          <a routerLink="/home" class="mat-headline-medium">Peopletrak</a>
          <mat-nav-list>
            <a
              mat-list-item
              routerLinkActive="active"
              #dashboard="routerLinkActive"
              [activated]="dashboard.isActive"
              routerLink="home"
            >
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <div matListItemTitle>Dashboard</div>
            </a>
            <a
              mat-list-item
              routerLinkActive="active"
              #employees="routerLinkActive"
              [activated]="employees.isActive"
              routerLink="employees"
            >
              <mat-icon matListItemIcon>groups</mat-icon>
              <div matListItemTitle>Empleados</div>
            </a>
            <a
              mat-list-item
              routerLinkActive="active"
              #branches="routerLinkActive"
              [activated]="branches.isActive"
              routerLink="branches"
            >
              <mat-icon matListItemIcon>store</mat-icon>
              <div matListItemTitle>Sucursales</div> </a
            ><a
              mat-list-item
              routerLinkActive="active"
              #departments="routerLinkActive"
              [activated]="departments.isActive"
              routerLink="departments"
            >
              <mat-icon matListItemIcon>account_tree</mat-icon>
              <div matListItemTitle>Areas</div> </a
            ><a
              mat-list-item
              routerLinkActive="active"
              #positions="routerLinkActive"
              [activated]="positions.isActive"
              routerLink="positions"
            >
              <mat-icon matListItemIcon>badge</mat-icon>
              <div matListItemTitle>Cargos</div>
            </a>
          </mat-nav-list>
        </div>
      </mat-sidenav>
      <mat-sidenav-content>
        @if (isHandset()) {
        <mat-toolbar>
          <button mat-icon-button (click)="toggleMenu()">
            <mat-icon>menu</mat-icon>
          </button>
        </mat-toolbar>
        }
        <main class="px-8 py-4">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: `
      main {
        height: calc(100% - var(--mat-toolbar-standard-height));
      }
    `,
  standalone: true,
  providers: [DashboardStore],
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
  ],
})
export class DashboardComponent implements OnInit {
  public isHandset = signal(false);
  public mode = computed(() => (this.isHandset() ? 'over' : 'side'));
  public role = computed(() => (this.isHandset() ? 'dialog' : 'navigation'));
  public sidenav = viewChild.required(MatSidenav);
  private breakpointObserver = inject(BreakpointObserver);

  ngOnInit() {
    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .subscribe((breakPoint) => this.isHandset.set(breakPoint.matches));
  }

  async toggleMenu() {
    if (this.isHandset()) {
      this.sidenav().toggle();
      return;
    }
    this.sidenav().open();
  }
}
