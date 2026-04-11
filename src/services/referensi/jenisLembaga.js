import { createCrudClient } from '@/services/baseCrud';

const jenisLembagaClient = createCrudClient('jenis-lembaga', 'jenis lembaga');

export const {
  getAll: getJenisLembaga,
  getDetail: getDetailJenisLembaga,
  add: addJenisLembaga,
  update: updateJenisLembaga,
  remove: deleteJenisLembaga,
} = jenisLembagaClient;
