import { createCrudClient } from '@/services/baseCrud';

const periodeClient = createCrudClient('periode', 'periode');

export const {
  getAll: getPeriode,
  getDetail: getDetailPeriode,
  add: addPeriode,
  update: updatePeriode,
  remove: deletePeriode,
} = periodeClient;
