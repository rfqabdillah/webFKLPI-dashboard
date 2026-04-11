import { createCrudClient } from '@/services/baseCrud';

const tnaKBJIClient = createCrudClient('tna-kbji', 'tna kbji');

export const {
  getAll: getTnaKBJI,
  getDetail: getDetailTnaKBJI,
  add: addTnaKBJI,
  update: updateTnaKBJI,
  remove: deleteTnaKBJI,
} = tnaKBJIClient;
