import { createCrudClient } from '@/services/baseCrud';

const peranClient = createCrudClient('peran', 'peran');

export const {
  getAll: getPeran,
  getDetail: getDetailPeran,
  add: addPeran,
  update: updatePeran,
  remove: deletePeran,
} = peranClient;
