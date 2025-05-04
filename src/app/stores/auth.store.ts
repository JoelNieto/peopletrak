import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { of, switchMap } from 'rxjs';

type State = {
  currentEmployeeId: string | null;
};

export const AuthStore = signalStore(
  withState<State>({
    currentEmployeeId: null,
  }),
  withProps(() => ({
    auth: inject(AuthService),
    _http: inject(HttpClient),
  })),
  withMethods(() => ({
    getUserEmployeeId: () => {
      return inject(AuthService).user$.pipe(
        switchMap((user) => {
          if (user) {
            return inject(HttpClient).get(
              `${process.env['ENV_SUPABASE_URL']}/rest/v1/employees`,
              {
                params: { email: `eq.${user.email}` },
              }
            );
          }
          return of(null);
        })
      );
    },
  }))
);
