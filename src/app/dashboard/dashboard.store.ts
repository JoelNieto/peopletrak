import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { differenceInMonths, getMonth } from 'date-fns';
import { ConfirmationService, MessageService } from 'primeng/api';
import { pipe, tap } from 'rxjs';
import {
  Branch,
  Company,
  Department,
  Employee,
  Position,
  Schedule,
  Termination,
  TimeOff,
  TimeOffType,
} from '../models';
import { SupabaseService } from '../services/supabase.service';

type Collection =
  | 'departments'
  | 'branches'
  | 'positions'
  | 'timeoff_types'
  | 'schedules'
  | 'companies';

type State = {
  loading: boolean;
  companies: Company[];
  branches: Branch[];
  departments: Department[];
  schedules: Schedule[];
  positions: Position[];
  employees: Employee[];
  timeoff_types: TimeOffType[];
  selected: Employee | null;
  selectedCompanyId: string | null;
};

const initialState: State = {
  loading: false,
  companies: [],
  branches: [],
  departments: [],
  positions: [],
  employees: [],
  schedules: [],
  timeoff_types: [],
  selected: null,
  selectedCompanyId: null,
};

export const DashboardStore = signalStore(
  withState(initialState),
  withComputed(({ employees, branches, companies, selectedCompanyId }) => {
    const headCount = computed(
      () => employees().filter((x) => x.is_active).length
    );

    const branchesCount = computed(
      () => branches().filter((x) => x.is_active).length
    );

    const selectedCompany = computed(() =>
      companies().find((x) => x.id === selectedCompanyId())
    );

    const employeesByGender = computed(() =>
      employees().reduce<
        {
          gender: string;
          count: number;
        }[]
      >((acc, item) => {
        const index = acc.findIndex((x) => x.gender === item.gender);
        if (index !== -1) {
          acc[index].count++;
        } else {
          acc.push({ gender: item.gender, count: 1 });
        }
        return acc;
      }, [])
    );

    const birthDates = computed(() =>
      employees()
        .filter((x) => x.is_active)
        .filter((x) =>
          x.birth_date ? getMonth(x.birth_date) === getMonth(new Date()) : false
        )
        .map(({ first_name, father_name, birth_date, branch }) => ({
          first_name,
          father_name,
          birth_date,
          branch,
        }))
    );

    const employeesByBranch = computed(() =>
      employees().reduce<
        {
          branch: Branch | undefined;
          count: number;
        }[]
      >((acc, item) => {
        const itemIndex = acc.findIndex((x) => x.branch?.id === item.branch_id);
        if (itemIndex !== -1) {
          acc[itemIndex].count++;
        } else {
          acc.push({ branch: item.branch, count: 1 });
        }
        return acc;
      }, [])
    );

    const employeesList = computed(() =>
      employees().map((item) => ({
        ...item,
        full_name: `${item.first_name} ${item.middle_name} ${item.father_name} ${item.mother_name}`,
        months: differenceInMonths(new Date(), item.start_date ?? new Date()),
        probatory:
          differenceInMonths(new Date(), item.start_date ?? new Date()) < 3,
      }))
    );

    return {
      headCount,
      employeesList,
      branchesCount,
      employeesByBranch,
      employeesByGender,
      birthDates,
      selectedCompany,
    };
  }),
  withMethods(
    (
      state,
      supabase = inject(SupabaseService),
      message = inject(MessageService),
      confirm = inject(ConfirmationService)
    ) => {
      const updateQuery = rxMethod<string | null>(
        pipe(
          tap(() => patchState(state, { loading: true })),
          tap(async () => {
            await Promise.all([
              fetchCollection('branches'),
              fetchCollection('departments'),
              fetchCollection('positions'),
              fetchCollection('timeoff_types'),
              fetchCollection('schedules'),
              fetchEmployees(),
            ]);
          })
        )
      );

      async function fetchCollection(collection: Collection) {
        patchState(state, { loading: true });
        let query = supabase.client
          .from(collection)
          .select(
            collection === 'positions'
              ? 'id, name, department_id, department:departments(id, name), created_at'
              : '*'
          )
          .order('name', { ascending: true });
        if (
          state.selectedCompanyId() &&
          collection !== 'companies' &&
          collection !== 'timeoff_types'
        ) {
          query = query.eq('company_id', state.selectedCompanyId());
        }
        try {
          const { data, error } = await query;
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
        let query = supabase.client
          .from('employees')
          .select(
            '*, branch:branches(*), department:departments(*), position:positions(*)'
          )
          .order('first_name', { ascending: true });

        if (state.selectedCompanyId()) {
          query = query.eq('company_id', state.selectedCompanyId());
        }
        try {
          const { data, error } = await query;

          if (error) throw error;
          patchState(state, { employees: data });
        } catch (error) {
          console.error(error);
        } finally {
          patchState(state, { loading: false });
        }
      }

      async function getSelected(id: string) {
        patchState(state, { loading: true });
        try {
          const { error, data } = await supabase.client
            .from('employees')
            .select(
              '*, branch:branches(*), department:departments(*), position:positions(*), timeoffs(*, type:timeoff_types(*)), qr_code'
            )
            .eq('id', id)
            .single();
          if (error) throw error;
          patchState(state, { selected: data });
        } catch (err) {
          console.error(err);
        } finally {
          patchState(state, { loading: false });
        }
      }

      const resetSelected = () => patchState(state, { selected: null });

      async function updateEmployee(request: Employee) {
        patchState(state, { loading: true });
        try {
          const { error } = await supabase.client
            .from('employees')
            .upsert(request);
          if (error) throw error;
          message.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'Cambios guardados exitosamente',
          });
          await fetchEmployees();
        } catch (error) {
          console.error(error);
          message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Intente nuevamente',
          });
          throw error;
        } finally {
          patchState(state, { loading: false });
        }
      }

      async function deleteItem({
        id,
        collection,
      }: {
        id: string;
        collection: Collection;
      }) {
        patchState(state, { loading: true });
        confirm.confirm({
          message: 'Desea eliminar este elemento?',
          header: 'Confirmar eliminar',
          icon: 'pi pi-info-circle',
          acceptLabel: 'Si, borrar',
          acceptButtonStyleClass: 'p-button-danger',
          rejectButtonStyleClass: 'p-button-text p-button-secondary',
          accept: async () => {
            try {
              const { error } = await supabase.client
                .from(collection)
                .delete()
                .eq('id', id);
              if (error) throw error;
              message.add({
                severity: 'success',
                summary: 'Exito',
                detail: 'Cambios guardados exitosamente',
              });
              await fetchCollection(collection);
            } catch (err) {
              console.error(err);
              message.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Intente nuevamente',
              });
            } finally {
              patchState(state, { loading: false });
            }
          },
          reject: () => {
            patchState(state, { loading: false });
          },
        });
      }

      async function deleteEmployee(id: string) {
        patchState(state, { loading: true });
        confirm.confirm({
          message: 'Desea eliminar este empleado?',
          header: 'Confirmar eliminar',
          icon: 'pi pi-info-circle',
          acceptLabel: 'Si, borrar',
          acceptButtonStyleClass: 'p-button-danger',
          rejectButtonStyleClass: 'p-button-text p-button-secondary',
          accept: async () => {
            try {
              const { error } = await supabase.client
                .from('employees')
                .delete()
                .eq('id', id);
              if (error) throw error;
              message.add({
                severity: 'success',
                summary: 'Exito',
                detail: 'Cambios guardados exitosamente',
              });
              patchState(state, {
                employees: state.employees().filter((x) => x.id !== id),
              });
            } catch (error) {
              console.error(error);
              message.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Intente nuevamente',
              });
            } finally {
              patchState(state, { loading: false });
            }
          },
          reject: () => {
            patchState(state, { loading: false });
          },
        });
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
          message.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'Cambios guardados exitosamente',
          });
          await fetchCollection(collection);
        } catch (error) {
          console.error(error);
          message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Intente nuevamente',
          });
          throw error;
        } finally {
          patchState(state, { loading: false });
        }
      }

      async function terminateEmployee(request: Termination) {
        patchState(state, { loading: true });
        try {
          const { error } = await supabase.client
            .from('terminations')
            .upsert(request);
          if (error) throw error;
          const employee = state
            .employees()
            .find((x) => x.id === request.employee_id);
          if (employee) {
            await supabase.client
              .from('employees')
              .update({ is_active: false })
              .eq('id', employee.id);
            message.add({
              severity: 'success',
              summary: 'Exito',
              detail: 'Cambios guardados exitosamente',
            });
            await fetchEmployees();
          }
        } catch (error) {
          console.error(error);
          message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Intente nuevamente',
          });
          throw error;
        } finally {
          patchState(state, { loading: false });
        }
      }

      async function saveTimeOff(request: TimeOff) {
        patchState(state, { loading: true });
        try {
          const { error } = await supabase.client
            .from('timeoffs')
            .upsert([request]);
          if (error) throw error;
          message.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'Tiempo fuera creado exitosamente',
          });
        } catch (err) {
          console.error(err);
          message.add({
            severity: 'error',
            summary: 'Ocurrio un error',
            detail: 'Intente nuevamente',
          });
        } finally {
          patchState(state, { loading: false });
        }
      }

      const toggleCompany = (id: string | null) =>
        patchState(state, { selectedCompanyId: id });

      return {
        fetchCollection,
        updateItem,
        deleteItem,
        fetchEmployees,
        updateEmployee,
        deleteEmployee,
        terminateEmployee,
        getSelected,
        resetSelected,
        saveTimeOff,
        toggleCompany,
        updateQuery,
      };
    }
  ),
  withHooks({
    onInit({ updateQuery, selectedCompanyId, fetchCollection }) {
      updateQuery(selectedCompanyId);
      fetchCollection('companies');
    },
  })
);
