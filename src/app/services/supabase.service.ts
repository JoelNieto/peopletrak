import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

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

  constructor() {
    this.client = createClient(environment.SUPABASE_URL, environment.API_KEY);
  }

  private _session: AuthSession | null = null;

  get session() {
    this.client.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }

  profile(user: User) {
    return this.client
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single();
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    };

    return this.client.from('profiles').upsert(update);
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.client.auth.onAuthStateChange(callback);
  }

  signIn(email: string) {
    console.log(environment.APP_URL);
    return this.client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: environment.APP_URL },
    });
  }

  public async isLoggedIn(): Promise<boolean> {
    const {
      data: { session },
    } = await this.client.auth.getSession();
    return !!session;
  }

  signOut() {
    return this.client.auth.signOut();
  }
}
