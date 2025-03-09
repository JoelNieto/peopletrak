import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pt-admin-schedules',
  imports: [CommonModule],
  template: `<p>admin-schedules works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSchedulesComponent {}
