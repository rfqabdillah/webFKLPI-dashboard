import { createCrudClient } from '@/services/baseCrud';

const jabatanClient = createCrudClient('jabatan', 'jabatan');

export const {
  getAll: getJabatan,
  getDetail: getDetailJabatan,
  add: addJabatan,
  update: updateJabatan,
  remove: deleteJabatan,
} = jabatanClient;
