import { createCrudClient } from '@/services/baseCrud';

const userTypeClient = createCrudClient('user-types', 'jenis pengguna');

export const {
  getAll: getUserTypes,
  getDetail: getDetailUserType,
  add: addUserType,
  update: updateUserType,
  remove: deleteUserType,
} = userTypeClient;