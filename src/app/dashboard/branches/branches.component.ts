import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Branch } from '../../models';
import { BranchesFormComponent } from '../branches-form/branches-form.component';
import { DashboardStore } from '../dashboard.store';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [
    MatTableModule,
    MatMenuModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
  ],
  template: `
    <div class="w-full flex justify-between">
      <h3 class="mat-title-4">Sucursales</h3>
      <button mat-flat-button (click)="editBranch()">Agregar</button>
    </div>
    <div class="overflow-auto">
      <table mat-table [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
          <td mat-cell *matCellDef="let item">
            {{ item.name }}
          </td>
        </ng-container>
        <ng-container matColumnDef="address">
          <th mat-header-cell *matHeaderCellDef>Direccion</th>
          <td mat-cell *matCellDef="let item">
            {{ item.address }}
          </td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let item">
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="editBranch(item)">Editar</button>
              <button mat-menu-item>Borrar</button>
            </mat-menu>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </div>

    <mat-paginator
      [length]="100"
      [pageSize]="10"
      [pageSizeOptions]="[5, 10, 25, 100]"
      aria-label="Select page"
    >
    </mat-paginator>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchesComponent implements AfterViewInit {
  readonly state = inject(DashboardStore);
  public displayedColumns = ['name', 'address', 'actions'];
  public sort = viewChild.required(MatSort);
  public paginator = viewChild.required(MatPaginator);
  public dataSource = new MatTableDataSource<Branch>([]);
  private dialog = inject(MatDialog);
  private viewRef = inject(ViewContainerRef);
  private injector = inject(Injector);

  ngAfterViewInit() {
    effect(
      () => {
        this.dataSource.data = this.state.branches();
        this.dataSource.sort = this.sort();
        this.dataSource.paginator = this.paginator();
      },
      { injector: this.injector }
    );
  }

  editBranch(branch?: Branch) {
    this.dialog.open(BranchesFormComponent, {
      viewContainerRef: this.viewRef,
      width: '36rem',
      data: { branch },
    });
  }
}
