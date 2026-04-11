import { createCrudClient } from '@/services/baseCrud';

const golonganDarahClient = createCrudClient('golongan-darah', 'golongan darah');

export const {
  getAll: getGolonganDarah,
  getDetail: getDetailGolonganDarah,
  add: addGolonganDarah,
  update: updateGolonganDarah,
  remove: deleteGolonganDarah,
} = golonganDarahClient;
