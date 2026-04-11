import { createCrudClient } from '@/services/baseCrud';

const organisasiClient = createCrudClient('fklpi', 'organisasi');

export const {
  getAll: getOrganisasi,
  getDetail: getDetailOrganisasi,
  add: addOrganisasi,
  update: updateOrganisasi,
  remove: deleteOrganisasi,
} = organisasiClient;
