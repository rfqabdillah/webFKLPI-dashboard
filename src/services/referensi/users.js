import { createCrudClient } from '@/services/baseCrud';

const userClient = createCrudClient('users', 'pengguna');

export const {
  getAll: getUsers,
  getDetail: getDetailUser,
  add: addUser,
  update: updateUser,
  remove: deleteUser,
} = userClient;