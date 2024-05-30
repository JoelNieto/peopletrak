import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  template: `<h1 class="mat-headline-4">employee-list works!</h1>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeListComponent {}
