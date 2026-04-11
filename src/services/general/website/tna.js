import { createCrudClient } from '@/services/baseCrud';

const tnaClient = createCrudClient('tna', 'tna');

export const {
  getAll: getTna,
  getDetail: getDetailTna,
  add: addTna,
  update: updateTna,
  remove: deleteTna,
} = tnaClient;
