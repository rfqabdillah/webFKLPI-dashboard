import { createCrudClient } from '@/services/baseCrud';

const jenisPembinaanClient = createCrudClient('jenis-pembinaan', 'jenis pembinaan');

export const {
  getAll: getJenisPembinaan,
  getDetail: getDetailJenisPembinaan,
  add: addJenisPembinaan,
  update: updateJenisPembinaan,
  remove: deleteJenisPembinaan,
} = jenisPembinaanClient;
