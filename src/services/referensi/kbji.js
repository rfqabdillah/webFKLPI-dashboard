import { createCrudClient } from '@/services/baseCrud';

const kbjiClient = createCrudClient('kbji', 'kbji');

export const {
  getAll: getKbji,
  getDetail: getDetailKbji,
  add: addKbji,
  update: updateKbji,
  remove: deleteKbji,
} = kbjiClient;
