import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { from, map, take } from 'rxjs';
import { SupabaseService } from './src/app/services/supabase.service';

export const authGuardFn: CanActivateFn = (next: ActivatedRouteSnapshot) => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);
  return from(supabase.isLoggedIn()).pipe(
    take(1),
    map((isLogged) => (isLogged ? isLogged : router.createUrlTree(['/login'])))
  );
};
