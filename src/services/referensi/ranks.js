import { createCrudClient } from '@/services/baseCrud';

const rankClient = createCrudClient('ranks', 'pangkat');

export const {
  getAll: getRanks,
  getDetail: getDetailRank,
  add: addRank,
  update: updateRank,
  remove: deleteRank,
} = rankClient;