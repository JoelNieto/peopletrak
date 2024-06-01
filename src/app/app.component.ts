import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupabaseService } from './services/supabase.service';

@Component({
  standalone: true,
  imports: [RouterOutlet],
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
