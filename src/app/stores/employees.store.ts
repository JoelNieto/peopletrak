import { computed } from '@angular/core';
import { signalStore, withComputed, withHooks } from '@ngrx/signals';
import { differenceInMonths, getMonth } from 'date-fns';
import { Branch, Employee } from '../models';
import { withCustomEntities } from './entities.feature';

export const EmployeesStore = signalStore(
  withCustomEntities<Employee>({
    name: 'employees',
    query:
      'id,first_name,middle_name,father_name,mother_name,birth_date,gender,start_date,monthly_salary,document_id,end_date,email,phone_number,is_active,uniform_size,created_at,branch:branches(*),department:departments(*),position:positions(*)',
  }),
  withComputed((state) => ({
    headCount: computed(
      () => state.entities().filter((x) => x.is_active).length
    ),
    employeesByGender: computed(() =>
      state.entities().reduce<
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
    ),
    employeesByBranch: computed(() =>
      state.entities().reduce<
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
    ),
    birthDates: computed(() =>
      state
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
    ),
    employeesList: computed(() =>
      state.entities().map((item) => ({
        ...item,
        full_name: `${item.first_name} ${item.middle_name} ${item.father_name} ${item.mother_name}`,
        short_name: `${item.first_name} ${item.father_name}`,
        months: differenceInMonths(new Date(), item.start_date ?? new Date()),
        probatory:
          differenceInMonths(new Date(), item.start_date ?? new Date()) < 3,
      }))
    ),
  })),
  withHooks({ onInit: ({ fetchItems }) => fetchItems() })
);
