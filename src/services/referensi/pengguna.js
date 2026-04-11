import { createCrudClient } from '@/services/baseCrud';

const penggunaClient = createCrudClient('pengguna', 'pengguna');

export const {
  getAll: getPengguna,
  getDetail: getDetailPengguna,
  add: addPengguna,
  update: updatePengguna,
  remove: deletePengguna,
} = penggunaClient;