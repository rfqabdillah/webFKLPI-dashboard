import { createCrudClient } from '@/services/baseCrud';

const pembinaanClient = createCrudClient('pembinaan', 'pembinaan');

export const {
  getAll: getPembinaan,
  getDetail: getDetailPembinaan,
  add: addPembinaan,
  update: updatePembinaan,
  remove: deletePembinaan,
} = pembinaanClient;
