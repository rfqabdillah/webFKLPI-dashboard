import { createCrudClient } from '@/services/baseCrud';

const lembagaClient = createCrudClient('uptp-uptd', 'lembaga');

export const {
  getAll: getLembaga,
  getDetail: getDetailLembaga,
  add: addLembaga,
  update: updateLembaga,
  remove: deleteLembaga,
} = lembagaClient;
