import { createCrudClient } from '@/services/baseCrud';

const testimoniClient = createCrudClient('testimoni', 'testimoni');

export const {
  getAll: getTestimoni,
  getDetail: getDetailTestimoni,
  add: addTestimoni,
  update: updateTestimoni,
  remove: deleteTestimoni,
} = testimoniClient;