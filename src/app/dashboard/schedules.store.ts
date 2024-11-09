import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { from, map, pipe, switchMap, tap } from 'rxjs';
import { Schedule } from '../models';
import { SupabaseService } from '../services/supabase.service';

type Store = {
  loading: boolean;
  schedules: Schedule[];
};
const initial: Store = {
  loading: false,
  schedules: [],
};

export const SchedulesStore = signalStore(
  withState(initial),
  withMethods((state, supabase = inject(SupabaseService)) => {
    const fetchSchedules = rxMethod<void>(
      pipe(
        tap(() => patchState(state, { loading: true })),
        switchMap(() =>
          from(
            supabase.client.from('schedules').select('*').order('created_at')
          ).pipe(
            map(({ error, data }) => {
              if (error) throw new Error(error.message);
              return data;
            }),
            tapResponse({
              next: (schedules) => patchState(state, { schedules }),
              error: (error) => console.error(error),
              finalize: () => patchState(state, { loading: false }),
            })
          )
        )
      )
    );
    return { fetchSchedules };
  }),
  withHooks({
    onInit({ fetchSchedules }) {
      fetchSchedules();
    },
  })
);
