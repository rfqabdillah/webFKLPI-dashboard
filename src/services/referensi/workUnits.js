import { createCrudClient } from '@/services/baseCrud';

const workUnitClient = createCrudClient('work-units', 'unit kerja');

export const {
  getAll: getWorkUnits,
  getDetail: getDetailWorkUnit,
  add: addWorkUnit,
  update: updateWorkUnit,
  remove: deleteWorkUnit,
} = workUnitClient;