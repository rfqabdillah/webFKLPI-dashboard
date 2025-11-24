import { createCrudClient } from '@/services/baseCrud';

const officialClient = createCrudClient('officials', 'pejabat');

export const {
  getAll: getOfficials,
  getDetail: getDetailOfficial,
  add: addOfficial,
  update: updateOfficial,
  remove: deleteOfficial,
} = officialClient;