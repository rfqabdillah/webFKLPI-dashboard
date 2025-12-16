import { createCrudClient } from '@/services/baseCrud';

const statusClient = createCrudClient('statuses', 'status');

export const {
  getAll: getStatuses,
  getDetail: getDetailStatus,
  add: addStatus,
  update: updateStatus,
  remove: deleteStatus,
} = statusClient;