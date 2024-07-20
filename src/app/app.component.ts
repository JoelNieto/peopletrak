import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
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
  session = this.supabase.session;

  ngOnInit() {
    this.supabase.authChanges((_, session) => (this.session = session));
  }
}
