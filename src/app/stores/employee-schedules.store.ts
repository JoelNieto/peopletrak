import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { EmployeeSchedule } from '../models';

import { HttpClient } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { eachDayOfInterval } from 'date-fns';
import { toDate } from 'date-fns-tz';
import { filter, pipe, switchMap, tap } from 'rxjs';

type State = {
  isLoading: boolean;
  error: any | null;
  schedules: EmployeeSchedule[];
  employeeId: string | null;
};

export const EmployeeScheduleStore = signalStore(
  withState<State>({
    isLoading: false,
    error: null,
    schedules: [],
    employeeId: null,
  }),
  withProps(() => ({
    _http: inject(HttpClient),
  })),
  withComputed((state) => ({
    employeesSchedules: computed(() =>
      state
        .schedules()
        ?.map((data) =>
          eachDayOfInterval({
            start: toDate(data.start_date, { timeZone: 'America/Panama' }),
            end: toDate(data.end_date, { timeZone: 'America/Panama' }),
          }).map((date) => ({ date, data }))
        )
        .flat()
    ),
  })),
  withMethods((state) => ({
    setEmployeeId: (employeeId: string) => patchState(state, { employeeId }),
    fetchSchedules: rxMethod<void>(
      pipe(
        filter(() => !!state.employeeId()),
        tap(() => patchState(state, { isLoading: true, error: false })),
        switchMap(() =>
          state._http
            .get<EmployeeSchedule[]>(
              `${process.env['ENV_SUPABASE_URL']}/rest/v1/employee_schedules`,
              {
                params: {
                  select: '*,schedule:schedules(*)',
                  employee_id: `eq.${state.employeeId()}`,
                },
              }
            )
            .pipe(
              tapResponse({
                next: (schedules) => patchState(state, { schedules }),
                error: (error) => patchState(state, { error }),
                finalize: () => patchState(state, { isLoading: false }),
              })
            )
        )
      )
    ),
  })),
  withHooks({ onInit: ({ fetchSchedules }) => fetchSchedules() })
);
