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
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Position } from '../../models';
import { DashboardStore } from '../dashboard.store';
import { PositionsFormComponent } from '../positions-form/positions-form.component';

@Component({
  selector: 'app-positions',
  standalone: true,
  imports: [
    MatMenuModule,
    MatIcon,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTableModule,
  ],
  template: ` <div class="w-full flex justify-between">
      <h3 class="mat-title-4">Cargos</h3>
      <button mat-flat-button (click)="editPosition()">Agregar</button>
    </div>
    <table mat-table [dataSource]="dataSource" matSort>
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
        <td mat-cell *matCellDef="let item">
          {{ item.name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="department">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Area</th>
        <td mat-cell *matCellDef="let item">
          {{ item.department?.name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let item">
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="editPosition(item)">Editar</button>
            <button mat-menu-item>Borrar</button>
          </mat-menu>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
    <mat-paginator
      [length]="100"
      [pageSize]="10"
      [pageSizeOptions]="[5, 10]"
      aria-label="Select page"
    >
    </mat-paginator>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PositionsComponent implements AfterViewInit {
  readonly state = inject(DashboardStore);
  public displayedColumns = ['name', 'department', 'actions'];
  public sort = viewChild.required(MatSort);
  public paginator = viewChild.required(MatPaginator);
  public dataSource = new MatTableDataSource<Position>([]);
  private dialog = inject(MatDialog);
  private viewRef = inject(ViewContainerRef);
  private injector = inject(Injector);

  ngAfterViewInit() {
    effect(
      () => {
        this.dataSource.data = this.state.positions();
        this.dataSource.sort = this.sort();
        this.dataSource.paginator = this.paginator();
      },
      { injector: this.injector }
    );
  }

  editPosition(position?: Position) {
    this.dialog.open(PositionsFormComponent, {
      viewContainerRef: this.viewRef,
      width: '36rem',
      data: { position },
    });
  }
}
