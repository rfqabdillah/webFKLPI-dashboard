import { createCrudClient } from '@/services/baseCrud';

const perusahaanClient = createCrudClient('perusahaan', 'perusahaan');

export const {
  getAll: getPerusahaan,
  getDetail: getDetailPerusahaan,
  add: addPerusahaan,
  update: updatePerusahaan,
  remove: deletePerusahaan,
} = perusahaanClient;
