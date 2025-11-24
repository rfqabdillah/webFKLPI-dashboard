import { createCrudClient } from '@/services/baseCrud';

const employeeTypeClient = createCrudClient('employee-types', 'jenis pegawai');

export const {
  getAll: getEmployeeTypes,
  getDetail: getDetailEmployeeType,
  add: addEmployeeType,
  update: updateEmployeeType,
  remove: deleteEmployeeType,
} = employeeTypeClient;