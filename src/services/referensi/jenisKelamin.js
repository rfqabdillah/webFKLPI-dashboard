import { createCrudClient } from '@/services/baseCrud';

const jenisKelaminClient = createCrudClient('jenis-kelamin', 'jenis kelamin');

export const {
  getAll: getJenisKelamin,
  getDetail: getDetailJenisKelamin,
  add: addJenisKelamin,
  update: updateJenisKelamin,
  remove: deleteJenisKelamin,
} = jenisKelaminClient;
