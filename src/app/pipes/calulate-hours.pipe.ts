import { Pipe, PipeTransform } from '@angular/core';
import { differenceInMinutes } from 'date-fns';
import { AttendanceSheet } from '../models';

@Pipe({
  name: 'calculateHours',
})
export class CalculateHoursPipe implements PipeTransform {
  transform(
    value: Partial<AttendanceSheet>,
    type: 'worked_hours' | 'overtime_hours' | 'late_hours' | 'lunch_hours'
  ): string {
    const { entry_time, exit_time, lunch_start_time, lunch_end_time } = value;

    if (!entry_time || !exit_time) {
      return '0:00';
    }

    if (type === 'worked_hours') {
      const totalMinutes = differenceInMinutes(exit_time, entry_time);
      const lunchMinutes =
        !lunch_start_time || !lunch_end_time
          ? 60
          : differenceInMinutes(lunch_end_time, lunch_start_time);
      const workedMinutes = totalMinutes - lunchMinutes;
      const hours = Math.floor(workedMinutes / 60);
      const minutes = workedMinutes % 60;
      return `<span>${hours}:${minutes.toString().padStart(2, '0')}</span>`;
    }

    if (type === 'overtime_hours') {
      const totalMinutes = differenceInMinutes(exit_time, entry_time);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `<span>${hours}:${minutes.toString().padStart(2, '0')}</span>`;
    }

    if (type === 'late_hours') {
      const totalMinutes = differenceInMinutes(exit_time, entry_time);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `<span>${hours}:${minutes.toString().padStart(2, '0')}</span>`;
    }

    if (type === 'lunch_hours') {
      const totalMinutes =
        !lunch_start_time || !lunch_end_time
          ? 60
          : differenceInMinutes(lunch_end_time, lunch_start_time);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `<span>${hours}:${minutes.toString().padStart(2, '0')}</span>`;
    }

    const totalMinutes =
      !lunch_start_time || !lunch_end_time
        ? 60
        : differenceInMinutes(lunch_end_time, lunch_start_time);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `<span>${hours}:${minutes.toString().padStart(2, '0')}</span>`;
  }
}
