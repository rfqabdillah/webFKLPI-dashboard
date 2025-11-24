import { createCrudClient } from '@/services/baseCrud';

const userLevelClient = createCrudClient('user-levels', 'pengguna-jenjang');

export const {
  getAll: getUserLevels,
  getDetail: getDetailUserLevel,
  add: addUserLevel,
  update: updateUserLevel,
  remove: deleteUserLevel,
} = userLevelClient;