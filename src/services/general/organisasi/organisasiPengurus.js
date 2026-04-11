import { createCrudClient } from '@/services/baseCrud';

const organisasiPengurusClient = createCrudClient('organisasi-pengurus', 'organisasi pengurus');

export const {
  getAll: getOrganisasiPengurus,
  getDetail: getDetailOrganisasiPengurus,
  add: addOrganisasiPengurus,
  update: updateOrganisasiPengurus,
  remove: deleteOrganisasiPengurus,
} = organisasiPengurusClient;
