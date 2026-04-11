import { createCrudClient } from '@/services/baseCrud';

const dokumenClient = createCrudClient('dokumen', 'dokumen');

export const {
  getAll: getDokumen,
  getDetail: getDetailDokumen,
  add: addDokumen,
  update: updateDokumen,
  remove: deleteDokumen,
} = dokumenClient;
