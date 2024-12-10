export type Company = {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  is_active: boolean;
  created_at?: Date;
};

export type Branch = {
  id: string;
  name: string;
  short_name: string;
  address: string;
  is_active: boolean;
  created_at?: Date;
};

export type Department = {
  id: string;
  name: string;
  created_at?: Date;
};
export type UniformSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL' | '4XL';

export type Position = {
  id: string;
  name: string;
  department_id: string;
  department?: Department;
  created_at?: Date;
};

export type Employee = {
  id: string;
  document_id: string;
  first_name: string;
  middle_name: string;
  father_name: string;
  mother_name: string;
  birth_date?: Date;
  gender: 'M' | 'F';
  start_date: Date;
  monthly_salary: number;
  branch_id: string;
  branch?: Branch;
  department_id: string;
  department?: Department;
  position_id: string;
  position?: Position;
  email: string;
  phone_number: string;
  address: string;
  end_date?: Date;
  created_at?: Date;
  is_active: boolean;
  uniform_size?: UniformSize;
  timeoffs?: TimeOff[];
  qr_code?: string;
  code_uri?: string;
};

export type TimeOffType = {
  id: string;
  name: string;
};

export type TimeOff = {
  id: string;
  type_id: string;
  type?: TimeOffType;
  employee_id: string;
  employee?: Employee;
  date_from: Date;
  date_to: Date;
  notes: string[];
  is_approved: boolean;
};

export type Termination = {
  id: string;
  employee_id: string;
  date: Date;
  notes: string;
  reason: 'DESPIDO' | 'RENUNCIA' | 'FIN_CONTRATO';
};

export interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

export interface ExportColumn {
  title: string;
  dataKey: string;
}
export interface Timestamp {
  id: string;
  employee_id: string;
  employee?: Employee;
  branch_id: string;
  branch?: Branch;
  company_id: string;
  company?: Company;
  date: Date;
  time: string;
}

export type Schedule = {
  id: string;
  name: string;
  entry_time: Date;
  lunch_start_time: Date;
  lunch_end_time: Date;
  exit_time: Date;
  created_at?: Date;
  minutes_tolerance: number;
  min_lunch_minutes: number;
  max_lunch_minutes: number;
};

export enum TimelogType {
  entry = 'Entrada',
  lunch_start = 'Inicio Almuerzo',
  lunch_end = 'Fin Almuerzo',
  exit = 'Salida',
}

export type TimeLogs = {
  id: string;
  employee_id: string;
  company_id: string;
  branch_id: string;
  type: TimelogType;
  created_at: Date;
};

export type EmployeeSchedule = {
  id: string;
  employee_id: string;
  schedule_id: string;
  schedule?: Schedule;
  start_date: Date;
  end_date: Date;
  created_at?: Date;
};
