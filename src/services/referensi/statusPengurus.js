import { createCrudClient } from '@/services/baseCrud';

const statusPengurusClient = createCrudClient('status-pengurus', 'status pengurus');

export const {
  getAll: getStatusPengurus,
  getDetail: getDetailStatusPengurus,
  add: addStatusPengurus,
  update: updateStatusPengurus,
  remove: deleteStatusPengurus,
} = statusPengurusClient;
