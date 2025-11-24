import { createCrudClient } from '@/services/baseCrud';

const applicationClient = createCrudClient('application', 'aplikasi');

export const {
  getAll: getApplication,
  getDetail: getDetailApplication,
  add: addApplication,
  update: updateApplication,
  remove: deleteApplication,
} = applicationClient;