import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timestamps-form',
  standalone: true,
  imports: [CommonModule],
  template: `<p>timestamps-form works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimestampsFormComponent {}
