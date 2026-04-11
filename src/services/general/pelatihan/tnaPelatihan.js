import { createCrudClient } from '@/services/baseCrud';

const tnaPelatihanClient = createCrudClient('tna-pelatihan', 'tna pelatihan');

export const {
  getAll: getTnaPelatihan,
  getDetail: getDetailTnaPelatihan,
  add: addTnaPelatihan,
  update: updateTnaPelatihan,
  remove: deleteTnaPelatihan,
} = tnaPelatihanClient;
