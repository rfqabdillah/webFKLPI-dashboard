import { createCrudClient } from '@/services/baseCrud';

const userPositionClient = createCrudClient('user-positions', 'pengguna-jenjang');

export const {
  getAll: getUserPositions,
  getDetail: getDetailUserPosition,
  add: addUserPosition,
  update: updateUserPosition,
  remove: deleteUserPosition,
} = userPositionClient;
