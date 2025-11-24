import { createCrudClient } from '@/services/baseCrud';

const userWorkUnitClient = createCrudClient('user-work-units', 'pengguna-unit-kerja');

export const {
  getAll: getUserWorkUnits,
  getDetail: getDetailUserWorkUnit,
  add: addUserWorkUnit,
  update: updateUserWorkUnit,
  remove: deleteUserWorkUnit,
} = userWorkUnitClient;