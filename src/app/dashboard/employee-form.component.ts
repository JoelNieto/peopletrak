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
import { ActivatedRoute, Router } from '@angular/router';
import { toDate } from 'date-fns-tz';
import * as OTPAuth from 'otpauth';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import QRCode from 'qrcode';
import { markGroupDirty } from 'src/app/services/util.service';
import { v4 } from 'uuid';
import { Employee, UniformSize } from '../models';
import { BranchesStore } from '../stores/branches.store';
import { CompaniesStore } from '../stores/companies.store';
import { DepartmentsStore } from '../stores/departments.store';
import { EmployeesStore } from '../stores/employees.store';
import { PositionsStore } from '../stores/positions.store';

@Component({
  selector: 'pt-employee-form',
  imports: [
    ReactiveFormsModule,
    InputText,
    InputNumber,
    DatePicker,
    Select,
    Checkbox,
    Button,
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
            placeholder="Nombre"
          />
        </div>
        <div class="input-container">
          <label for="middle_name">Segundo Nombre</label>
          <input
            type="text"
            id="middle_name"
            pInputText
            formControlName="middle_name"
            placeholder="Segundo Nombre"
          />
        </div>
        <div class="input-container">
          <label for="father_name">Apellido</label>
          <input
            type="text"
            id="father_name"
            pInputText
            formControlName="father_name"
            placeholder="Apellido"
          />
        </div>
        <div class="input-container">
          <label for="mother_name">Apellido materno/casada</label>
          <input
            type="text"
            id="mother_name"
            pInputText
            formControlName="mother_name"
            placeholder="Apellido materno"
          />
        </div>
        <div class="input-container">
          <label for="birth_date">Fecha de nacimiento</label>
          <p-datepicker
            inputId="birth_date"
            formControlName="birth_date"
            iconDisplay="input"
            [showIcon]="true"
            appendTo="body"
            placeholder="dd/mm/yyyy"
          />
        </div>
        <div class="input-container">
          <label for="document_id">Cédula</label>
          <input
            type="text"
            id="document_id"
            pInputText
            formControlName="document_id"
            placeholder="Cédula de identidad"
          />
        </div>
        <div class="input-container">
          <label for="address">Dirección</label>
          <input
            type="text"
            id="address"
            pInputText
            formControlName="address"
            placeholder="Calle, Ciudad, Provincia"
          />
        </div>
        <div class="input-container">
          <label for="email">Email</label>
          <input type="email" id="email" pInputText formControlName="email" />
        </div>
        <div class="input-container">
          <label for="phone_number">Nro. Teléfono</label>
          <input
            type="text"
            id="phone_number"
            pInputText
            formControlName="phone_number"
            placeholder="Teléfono"
          />
        </div>
        <div class="input-container">
          <label for="gender">Sexo</label>
          <p-select
            inputId="gender"
            [options]="['F', 'M']"
            formControlName="gender"
            appendTo="body"
            placeholder="Seleccione un sexo"
          />
        </div>
        <div class="input-container">
          <label for="branch">Sucursal</label>
          <p-select
            [options]="branches.entities()"
            optionLabel="name"
            optionValue="id"
            inputId="branch"
            formControlName="branch_id"
            appendTo="body"
            placeholder="Seleccione una sucursal"
          />
        </div>
        <div class="input-container">
          <label for="department">Area</label>
          <p-select
            [options]="departments.entities()"
            optionLabel="name"
            optionValue="id"
            inputId="department"
            formControlName="department_id"
            appendTo="body"
            placeholder="Seleccione un area"
          />
        </div>
        <div class="input-container">
          <label for="position">Cargo</label>
          <p-select
            [options]="positions.entities()"
            optionLabel="name"
            optionValue="id"
            inputId="position"
            formControlName="position_id"
            appendTo="body"
            placeholder="Seleccione un cargo"
          />
        </div>
        <div class="input-container">
          <label for="salary">Salario</label>
          <p-inputNumber
            mode="currency"
            currency="USD"
            formControlName="monthly_salary"
            id="salary"
            placeholder="Salario mensual"
          />
        </div>
        <div class="input-container">
          <label for="size">Talla</label>
          <p-select
            inputId="size"
            [options]="sizes"
            formControlName="uniform_size"
            appendTo="body"
            placeholder="Seleccione una talla"
          />
        </div>
        <div class="input-container">
          <label for="start_date">Fecha de inicio</label>
          <p-datepicker
            inputId="start_date"
            formControlName="start_date"
            iconDisplay="input"
            [showIcon]="true"
            appendTo="body"
            placeholder="dd/mm/yyyy"
          />
        </div>
        <div class="input-container">
          <label for="bank">Banco</label>
          <p-select
            inputId="bank"
            [options]="banks"
            formControlName="bank"
            appendTo="body"
            filter
            placeholder="Seleccione un banco"
          />
        </div>
        <div class="input-container">
          <label for="account_number">Nro. de cuenta</label>
          <input
            type="text"
            id="account_number"
            pInputText
            formControlName="account_number"
            placeholder="Nro. de cuenta"
          />
        </div>
        <div class="input-container">
          <label for="bank_account_type">Tipo de cuenta</label>
          <p-select
            inputId="bank_account_type"
            [options]="['Ahorros', 'Corriente']"
            formControlName="bank_account_type"
            appendTo="body"
            placeholder="Seleccione un tipo de cuenta"
          />
        </div>
        <div class="input-container">
          <label for="company">Empresa</label>
          <p-select
            [options]="companies.entities()"
            optionLabel="name"
            optionValue="id"
            inputId="company"
            formControlName="company_id"
            placeholder="Seleccione una empresa"
            appendTo="body"
          />
        </div>
        <div class="flex gap-2 items-center">
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
            [loading]="store.isLoading()"
          />
        </div>
      </div>
    </form>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormComponent implements OnInit {
  public store = inject(EmployeesStore);
  branches = inject(BranchesStore);
  companies = inject(CompaniesStore);
  positions = inject(PositionsStore);
  departments = inject(DepartmentsStore);
  public sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
  public banks = [
    'Banco General',
    'Banco Nacional de Panama',
    'Caja de Ahorros',
    'Bac/Credomatic',
    'Banistmo',
    'Banesco',
    'Banisi',
    'Global Bank',
    'Credicorp Bank',
    'Multibank',
    'Metrobank',
    'Scotiabank',
    'St. Georges Bank',
    'Banco Hipotecario Nacional',
    'Banco Aliado',
    'Banco Azteca',
    'Banco Panamá',
    'Banco Prival',
    'Banco Pichincha',
    'Banco Lafise',
    'Banco Delta',
    'Banco Ficohsa',
    'Banco Promerica',
  ];
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
    company_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    monthly_salary: new FormControl(0, { nonNullable: true }),
    qr_code: new FormControl('', { nonNullable: true }),
    code_uri: new FormControl('', { nonNullable: true }),
    bank: new FormControl('', { nonNullable: true }),
    account_number: new FormControl('', { nonNullable: true }),
    bank_account_type: new FormControl<'Ahorros' | 'Corriente'>('Ahorros', {
      nonNullable: true,
    }),
  });

  private confirmationService = inject(ConfirmationService);

  ngOnInit() {
    if (this.employee_id()) {
      this.store.selectEntity(this.employee_id()!);
    }
    effect(
      () => {
        if (!this.store.selectedEntity()) return;

        untracked(() => {
          this.preloadForm(this.store.selectedEntity()!);
        });
      },
      { injector: this.injector }
    );
  }

  preloadForm(employee: Employee) {
    this.form.patchValue(employee);
    console.log(employee);
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

  saveChanges() {
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
    if (!this.employee_id()) {
      this.addTimeclockQR();
    }
    if (this.employee_id()) {
      this.store.editItem(this.form.getRawValue()).subscribe();
    } else {
      this.store.createItem(this.form.getRawValue()).subscribe();
    }
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

  private addTimeclockQR() {
    const { first_name, father_name } = this.form.getRawValue();
    const totp = new OTPAuth.TOTP({
      issuer: 'Peopletrak Blackdog',
      label: `${first_name.trim()} ${father_name.trim()}`,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
    });

    const uri = totp.toString();
    QRCode.toDataURL(uri, async (error, qrCode) => {
      if (error) {
        console.error(error);
        return;
      }
      this.form.patchValue({ qr_code: qrCode, code_uri: uri });
    });
  }
}
