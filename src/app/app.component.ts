import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';

import es from '../assets/i18n/es.json';
import { SupabaseService } from './services/supabase.service';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  providers: [MessageService],
  selector: 'app-root',
  template: ` <router-outlet /> `,
  styles: ``,
})
export class AppComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private config = inject(PrimeNGConfig);
  session = this.supabase.session;

  ngOnInit() {
    this.supabase.authChanges((_, session) => (this.session = session));
    this.config.setTranslation(es);
  }
}
