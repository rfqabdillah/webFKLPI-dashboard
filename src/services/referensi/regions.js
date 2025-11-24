import { createCrudClient } from '@/services/baseCrud';

const regionClient = createCrudClient('regions', 'wilayah');

export const {
  getAll: getRegions,
  getDetail: getDetailRegion,
  add: addRegion,
  update: updateRegion,
  remove: deleteRegion,
} = regionClient;