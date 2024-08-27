import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  input,
  OnInit,
  untracked,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toDate } from 'date-fns-tz';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { v4 } from 'uuid';

import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { markGroupDirty } from 'src/app/services/util.service';
import { Employee, UniformSize } from '../../models';
import { DashboardStore } from '../dashboard.store';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    CheckboxModule,
  ],
  template: `
    <h1>Datos del empleado</h1>
    <p-button
      text
      label="Volver al listado"
      icon="pi pi-arrow-left"
      (onClick)="cancelChanges(true)"
    />
    <form class="mt-4" [formGroup]="form" (ngSubmit)="saveChanges()">
      <div class="flex flex-col md:grid grid-cols-4 md:gap-4">
        <div class="input-container">
          <label for="first_name">* Nombre</label>
          <input
            type="text"
            id="first_name"
            pInputText
            formControlName="first_name"
          />
        </div>
        <div class="input-container">
          <label for="middle_name">Segundo Nombre</label>
          <input
            type="text"
            id="middle_name"
            pInputText
            formControlName="middle_name"
          />
        </div>
        <div class="input-container">
          <label for="father_name">Apellido</label>
          <input
            type="text"
            id="father_name"
            pInputText
            formControlName="father_name"
          />
        </div>
        <div class="input-container">
          <label for="mother_name">Apellido materno/casada</label>
          <input
            type="text"
            id="mother_name"
            pInputText
            formControlName="mother_name"
          />
        </div>
        <div class="input-container">
          <label for="birth_date">Fecha de nacimiento</label>
          <p-calendar
            inputId="birth_date"
            formControlName="birth_date"
            iconDisplay="input"
            [showIcon]="true"
            appendTo="body"
          />
        </div>
        <div class="input-container">
          <label for="document_id">Cedula</label>
          <input
            type="text"
            id="document_id"
            pInputText
            formControlName="document_id"
          />
        </div>
        <div class="input-container">
          <label for="address">Direccion</label>
          <input
            type="text"
            id="address"
            pInputText
            formControlName="address"
          />
        </div>
        <div class="input-container">
          <label for="email">Email</label>
          <input type="email" id="email" pInputText formControlName="email" />
        </div>
        <div class="input-container">
          <label for="phone_number">Nro. Telefono</label>
          <input
            type="text"
            id="phone_number"
            pInputText
            formControlName="phone_number"
          />
        </div>
        <div class="input-container">
          <label for="gender">Sexo</label>
          <p-dropdown
            inputId="gender"
            [options]="['F', 'M']"
            formControlName="gender"
          />
        </div>
        <div class="input-container">
          <label for="branch">Sucursal</label>
          <p-dropdown
            [options]="state.branches()"
            optionLabel="name"
            optionValue="id"
            inputId="branch"
            formControlName="branch_id"
          />
        </div>
        <div class="input-container">
          <label for="department">Area</label>
          <p-dropdown
            [options]="state.departments()"
            optionLabel="name"
            optionValue="id"
            inputId="department"
            formControlName="department_id"
          />
        </div>
        <div class="input-container">
          <label for="position">Cargo</label>
          <p-dropdown
            [options]="state.positions()"
            optionLabel="name"
            optionValue="id"
            inputId="position"
            formControlName="position_id"
          />
        </div>
        <div class="input-container">
          <label for="salary">Salario</label>
          <p-inputNumber
            mode="currency"
            currency="USD"
            formControlName="monthly_salary"
            id="salary"
          />
        </div>
        <div class="input-container">
          <label for="size">Talla</label>
          <p-dropdown
            inputId="size"
            [options]="sizes"
            formControlName="uniform_size"
            appendTo="body"
          />
        </div>
        <div class="input-container">
          <label for="start_date">Fecha de inicio</label>
          <p-calendar
            inputId="start_date"
            formControlName="start_date"
            iconDisplay="input"
            [showIcon]="true"
            appendTo="body"
          />
        </div>
        <div class="flex gap-2">
          <p-checkbox
            formControlName="is_active"
            [binary]="true"
            inputId="is_active"
          />
          <label for="is_active">Activo</label>
        </div>

        <div class="flex col-span-4 justify-end gap-2">
          <p-button
            label="Cancelar"
            severity="secondary"
            outlined
            icon="pi pi-refresh"
            (click)="cancelChanges()"
          />
          <p-button
            label="Guardar cambios"
            type="submit"
            icon="pi pi-save"
            [loading]="state.loading()"
          />
        </div>
      </div>
    </form>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormComponent implements OnInit {
  public state = inject(DashboardStore);
  public sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
  public employee_id = input<string>();
  private injector = inject(Injector);
  private message = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    first_name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    middle_name: new FormControl('', { nonNullable: true }),
    father_name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    mother_name: new FormControl('', { nonNullable: true }),
    document_id: new FormControl('', {
      nonNullable: true,
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email],
    }),
    phone_number: new FormControl('', {
      nonNullable: true,
    }),
    address: new FormControl('', { nonNullable: true }),
    birth_date: new FormControl<Date | undefined>(undefined, {
      nonNullable: true,
    }),
    start_date: new FormControl<Date>(new Date(), {
      nonNullable: true,
    }),
    branch_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    department_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    position_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    gender: new FormControl<'F' | 'M'>('M', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    uniform_size: new FormControl<UniformSize | undefined>(undefined, {
      nonNullable: true,
    }),
    is_active: new FormControl(true, { nonNullable: true }),
    monthly_salary: new FormControl(0, { nonNullable: true }),
  });

  private confirmationService = inject(ConfirmationService);

  ngOnInit() {
    if (this.employee_id()) {
      this.state.getSelected(this.employee_id()!);
    }
    effect(
      () => {
        if (!this.state.selected()) return;

        untracked(() => {
          this.preloadForm(this.state.selected()!);
        });
      },
      { injector: this.injector }
    );
  }

  preloadForm(employee: Employee) {
    this.form.patchValue(employee);
    employee.birth_date &&
      this.form
        .get('birth_date')
        ?.patchValue(
          toDate(employee.birth_date, { timeZone: 'America/Panama' })
        );
    this.form
      .get('start_date')
      ?.patchValue(toDate(employee.start_date, { timeZone: 'America/Panama' }));
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  async saveChanges() {
    const { pristine, invalid } = this.form;
    if (invalid) {
      this.message.add({
        severity: 'error',
        summary: 'No se guardaron cambios',
        detail: 'Formulario invalido',
      });
      markGroupDirty(this.form);
      this.form.get('first_name')?.markAsDirty();
      return;
    }
    if (pristine) {
      this.message.add({
        severity: 'warn',
        summary: 'No se guardaron cambios',
        detail: 'No ha realizado ningun cambio en el formulario',
      });
      return;
    }
    await this.state
      .updateEmployee(this.form.getRawValue())
      .then(() => this.router.navigate(['..'], { relativeTo: this.route }))
      .catch((error) => console.log({ error }));
  }

  cancelChanges(list = false) {
    const route = list ? ['../..'] : ['..'];
    if (this.form.pristine) {
      this.router.navigate(route, { relativeTo: this.route });
      return;
    }

    this.confirmationService.confirm({
      message: '¿Desea cancelar los cambios?',
      header: 'Cancelar',
      accept: () => {
        this.router.navigate(route, { relativeTo: this.route });
      },
    });
  }
}
