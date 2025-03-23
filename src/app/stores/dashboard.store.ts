import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { differenceInMonths, getMonth } from 'date-fns';
import { Branch } from '../models';
import { BranchesStore } from './branches.store';
import { CompaniesStore } from './companies.store';
import { EmployeesStore } from './employees.store';

type State = {
  selectedCompanyId: string | null;
};

const initialState: State = {
  selectedCompanyId: null,
};

export const DashboardStore = signalStore(
  withState(initialState),
  withProps(() => ({
    _companies: inject(CompaniesStore),
    _employees: inject(EmployeesStore),
    _branches: inject(BranchesStore),
  })),
  withComputed(({ _employees, _branches, _companies, selectedCompanyId }) => {
    const headCount = computed(
      () => _employees.entities().filter((x) => x.is_active).length
    );

    const branchesCount = computed(
      () => _branches.entities().filter((x) => x.is_active).length
    );

    const selectedCompany = computed(() =>
      _companies.entities().find((x) => x.id === selectedCompanyId())
    );

    const employeesByGender = computed(() =>
      _employees.entities().reduce<
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
      _employees
        .entities()
        .filter((x) => x.is_active)
        .filter(
          (x) =>
            x.birth_date && (x.birth_date as unknown as string) !== '1970-01-01'
        )
        .filter((x) => getMonth(x.birth_date!) === getMonth(new Date()))
        .sort(
          (a, b) =>
            new Date(a.birth_date!).getDate() -
            new Date(b.birth_date!).getDate()
        )
        .map(({ first_name, father_name, birth_date, branch }) => ({
          first_name,
          father_name,
          birth_date,
          branch,
        }))
    );

    const employeesByBranch = computed(() =>
      _employees.entities().reduce<
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
      _employees.entities().map((item) => ({
        ...item,
        full_name: `${item.first_name} ${item.middle_name} ${item.father_name} ${item.mother_name}`,
        short_name: `${item.first_name} ${item.father_name}`,
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
  withMethods((state) => {
    const toggleCompany = (id: string | null) =>
      patchState(state, { selectedCompanyId: id });

    return {
      toggleCompany,
    };
  })
);
