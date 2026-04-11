import { createCrudClient } from '@/services/baseCrud';

const halamanClient = createCrudClient('halaman', 'halaman');

export const {
  getAll: getHalaman,
  getDetail: getDetailHalaman,
  add: addHalaman,
  update: updateHalaman,
  remove: deleteHalaman,
} = halamanClient;
