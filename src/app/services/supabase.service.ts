import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth0/auth0-angular';
import {
  AuthSession,
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { lastValueFrom, Observable } from 'rxjs';

export interface Profile {
  id?: string;
  username: string;
  website: string;
  avatar_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  public client: SupabaseClient;

  constructor(private auth0: AuthService) {
    this.client = createClient(
      process.env['ENV_SUPABASE_URL'] ?? '',
      process.env['ENV_SUPABASE_API_KEY'] ?? '',
      {
        accessToken: async () => {
          const token = await lastValueFrom(
            this.auth0.getAccessTokenSilently()
          );
          return token;
        },
      }
    );
  }

  private _session: AuthSession | null = null;

  userInfo() {
    return toSignal(this.auth0.user$);
  }

  signIn() {
    this.auth0.loginWithRedirect({});
  }

  public isLoggedIn(): Observable<boolean> {
    return this.auth0.isAuthenticated$;
  }

  signOut() {
    return this.auth0.logout();
  }
}
