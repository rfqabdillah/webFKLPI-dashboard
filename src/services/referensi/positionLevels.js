import { createCrudClient } from '@/services/baseCrud';

const positionLevelClient = createCrudClient('levels', 'jenjang jabatan');

export const {
  getAll: getPositionLevels,
  getDetail: getDetailPositionLevel,
  add: addPositionLevel,
  update: updatePositionLevel,
  remove: deletePositionLevel,
} = positionLevelClient;