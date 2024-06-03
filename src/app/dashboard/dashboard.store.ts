import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Branch, Department, Employee, Position } from '../models';
import { SupabaseService } from '../services/supabase.service';

type Collection = 'departments' | 'branches' | 'positions';

type State = {
  loading: boolean;
  branches: Branch[];
  departments: Department[];
  positions: Position[];
  employees: Employee[];
};

const initialState: State = {
  loading: false,
  branches: [],
  departments: [],
  positions: [],
  employees: [],
};

export const DashboardStore = signalStore(
  withState(initialState),
  withMethods(
    (
      state,
      supabase = inject(SupabaseService),
      snackBar = inject(MatSnackBar)
    ) => {
      async function fetchCollection(collection: Collection) {
        patchState(state, { loading: true });
        try {
          const { data, error } = await supabase.client
            .from(collection)
            .select(
              collection === 'positions'
                ? 'id, name, department_id, department:departments(id, name), created_at'
                : '*'
            )
            .order('name', { ascending: true });
          if (error) throw error;
          patchState(state, () => ({ [collection]: data }));
        } catch (error) {
          console.error(error);
        } finally {
          patchState(state, { loading: false });
        }
      }

      async function fetchEmployees() {
        patchState(state, { loading: true });
        try {
          const { data, error } = await supabase.client
            .from('employees')
            .select(
              '*, branch:branches(id, name), department:departments(id, name), position:positions(id, name)'
            );

          if (error) throw error;
          patchState(state, { employees: data });
        } catch (error) {
          console.error(error);
        } finally {
          patchState(state, { loading: false });
        }
      }

      async function updateEmployee(request: Employee) {
        patchState(state, { loading: true });
        try {
          const { error } = await supabase.client
            .from('employees')
            .upsert(request);
          if (error) throw error;
          snackBar.open('Cambios guardados');
          await fetchEmployees();
        } catch (error) {
          console.error(error);
          snackBar.open('Intente nuevamente');
        } finally {
          patchState(state, { loading: false });
        }
      }

      async function updateItem({
        request,
        collection,
      }: {
        request: unknown;
        collection: Collection;
      }) {
        patchState(state, { loading: true });
        try {
          const { error } = await supabase.client
            .from(collection)
            .upsert(request);
          if (error) throw error;
          snackBar.open('Cambios guardados');
          await fetchCollection(collection);
        } catch (error) {
          console.error(error);
          snackBar.open('Intente nuevamente');
        } finally {
          patchState(state, { loading: false });
        }
      }

      return { fetchCollection, updateItem, fetchEmployees, updateEmployee };
    }
  ),
  withHooks({
    async onInit({ fetchCollection, fetchEmployees }) {
      await fetchCollection('branches');
      await fetchCollection('departments');
      await fetchCollection('positions');
      await fetchEmployees();
    },
  })
);
