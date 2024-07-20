import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
  ],
  template: `
    <div class="w-full h-screen flex flex-col items-center justify-center p-4">
      <p-toast />
      <p-card
        header="Iniciar sesion"
        subheader="Introduzca su correo y revise su buzon para el enlace"
        class="w-full md:w-2/5"
      >
        <div class="flex flex-col gap-2">
          <label for="email">Email</label>
          <input type="email" pInputText id="email" [formControl]="email" />
        </div>
        <ng-template pTemplate="footer">
          <p-button
            label="Entrar"
            [disabled]="email.invalid"
            (click)="signIn()"
          />
        </ng-template>
      </p-card>
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
  private message = inject(MessageService);

  async signIn() {
    try {
      const { error } = await this.supabase.signIn(this.email.getRawValue());

      if (error) throw error;
      this.message.add({
        severity: 'success',
        summary: 'Exito',
        detail: 'Link enviado exitosamente!',
      });
      this.email.reset();
    } catch (error) {
      console.error(error);
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Algo salio mal, intente nuevamente',
      });
    }
  }
}
