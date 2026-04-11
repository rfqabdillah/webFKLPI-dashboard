import { createCrudClient } from '@/services/baseCrud';

const mouClient = createCrudClient('mou', 'mou');

export const {
  getAll: getMou,
  getDetail: getDetailMou,
  add: addMou,
  update: updateMou,
  remove: deleteMou,
} = mouClient;
