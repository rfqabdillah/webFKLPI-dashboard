import { createCrudClient } from '@/services/baseCrud';

const userRankClient = createCrudClient('user-ranks', 'pengguna-pangkat');

export const {
  getAll: getUserRanks,
  getDetail: getDetailUserRank,
  add: addUserRank,
  update: updateUserRank,
  remove: deleteUserRank,
} = userRankClient;