import { createCrudClient } from '@/services/baseCrud';

const scaleClient = createCrudClient('scale', 'skala');

export const {
  getAll: getScales,
  getDetail: getDetailScale,
  add: addScale,
  update: updateScale,
  remove: deleteScale,
} = scaleClient;