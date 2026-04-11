import { createCrudClient } from '@/services/baseCrud';

const metodePembinaanClient = createCrudClient('metode-pembinaan', 'metode pembinaan');

export const {
  getAll: getMetodePembinaan,
  getDetail: getDetailMetodePembinaan,
  add: addMetodePembinaan,
  update: updateMetodePembinaan,
  remove: deleteMetodePembinaan,
} = metodePembinaanClient;
