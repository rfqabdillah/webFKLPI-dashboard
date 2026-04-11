import { createCrudClient } from '@/services/baseCrud';

const wilayahClient = createCrudClient('wilayah', 'wilayah');

export const {
  getAll: getWilayah,
  getDetail: getDetailWilayah,
  add: addWilayah,
  update: updateWilayah,
  remove: deleteWilayah,
} = wilayahClient;
