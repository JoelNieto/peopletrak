import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-time-off-form',
  standalone: true,
  imports: [MatDialogModule, MatButton, ReactiveFormsModule],
  template: ` <form>
    <h2 mat-dialog-title>Vacaciones/Ausencias</h2>
    <mat-dialog-content> </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-stroked-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button>Guardar cambios</button>
    </mat-dialog-actions>
  </form>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeOffFormComponent {}
