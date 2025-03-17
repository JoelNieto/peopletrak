import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Toast } from 'primeng/toast';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'pt-login',
  imports: [ReactiveFormsModule, Card, InputText, Button, Toast, RouterLink],
  template: `
    <div class="w-full h-screen flex flex-col items-center justify-center p-4">
      <p-toast />
      <p-card class="w-full md:w-2/5">
        <ng-template #title>Iniciar sesion</ng-template>
        <ng-template #subtitle
          >Introduzca su correo y revise su buzon para el enlace</ng-template
        >
        <div class="flex flex-col gap-2">
          <label for="email">Email</label>
          <input type="email" pInputText id="email" [formControl]="email" />
        </div>
        <ng-template #footer>
          <div class="flex flex-col sm:flex-row gap-4 sm:justify-end">
            <p-button
              label="Entrar al dashboard"
              [disabled]="email.invalid"
              (click)="signIn()"
            />
            <a
              routerLink="/timeclock"
              class="p-button font-bold p-button-outlined"
            >
              Ir al reloj
            </a>
          </div>
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
  public supabase = inject(SupabaseService);
  private message = inject(MessageService);

  async signIn() {
    await this.supabase.signIn();
  }
}
