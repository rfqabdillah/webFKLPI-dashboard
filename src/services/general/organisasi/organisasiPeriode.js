import { createCrudClient } from '@/services/baseCrud';

const organisasiPeriodeClient = createCrudClient('organisasi-periode', 'organisasi periode');

export const {
  getAll: getOrganisasiPeriode,
  getDetail: getDetailOrganisasiPeriode,
  add: addOrganisasiPeriode,
  update: updateOrganisasiPeriode,
  remove: deleteOrganisasiPeriode,
} = organisasiPeriodeClient;
