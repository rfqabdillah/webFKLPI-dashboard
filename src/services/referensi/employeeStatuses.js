import { createCrudClient } from '@/services/baseCrud';

const employeeStatusClient = createCrudClient('employee-statuses', 'status pegawai');

export const {
  getAll: getEmployeeStatuses,
  getDetail: getDetailEmployeeStatus,
  add: addEmployeeStatus,
  update: updateEmployeeStatus,
  remove: deleteEmployeeStatus,
} = employeeStatusClient;