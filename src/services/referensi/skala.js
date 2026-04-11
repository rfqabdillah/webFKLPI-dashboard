import { createCrudClient } from '@/services/baseCrud';

const skalaClient = createCrudClient('skala', 'skala');

export const {
  getAll: getSkala,
  getDetail: getDetailSkala,
  add: addSkala,
  update: updateSkala,
  remove: deleteSkala,
} = skalaClient;
