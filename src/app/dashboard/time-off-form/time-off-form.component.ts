import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-off-form',
  standalone: true,
  imports: [CommonModule],
  template: `<p>time-off-form works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeOffFormComponent {}
