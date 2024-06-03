export type Branch = {
  id: string;
  name: string;
  address: string;
  is_active: boolean;
  created_at?: Date;
};

export type Department = {
  id: string;
  name: string;
  created_at?: Date;
};

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
  start_date?: Date;
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
};
