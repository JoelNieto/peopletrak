import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="w-full h-screen flex flex-col items-center justify-center p-4">
      <mat-card class="w-full md:w-1/5">
        <mat-card-header>
          <mat-card-title> Login</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field>
            <mat-label>Email</mat-label>
            <input type="email" matInput [formControl]="email" />
          </mat-form-field>
        </mat-card-content>
        <mat-card-actions align="end">
          <button
            mat-flat-button
            type="button"
            [disabled]="email.invalid"
            (click)="signIn()"
          >
            Entrar
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  private supabase = inject(SupabaseService);
  private snackBar = inject(MatSnackBar);

  async signIn() {
    try {
      const { error } = await this.supabase.signIn(this.email.getRawValue());

      if (error) throw error;
      this.snackBar.open('Link enviado exitosamente!');
    } catch (error) {
      console.error(error);
      this.snackBar.open('Intente nuevamente');
    }
  }
}
