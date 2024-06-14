import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation',
  standalone: true,
  imports: [MatDialogModule, MatButton],
  template: `<h2 mat-dialog-title>Confirmar borrado</h2>
    <mat-dialog-content>
      <p class="mat-body-large">Desea borrar esto?</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-stroked-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button [mat-dialog-close]="true">Si, borrar</button>
    </mat-dialog-actions>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmationComponent {}
