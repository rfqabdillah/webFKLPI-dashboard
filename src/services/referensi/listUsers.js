import { createCrudClient } from '@/services/baseCrud';

const listUserClient = createCrudClient('list-users', 'pengguna');

export const {
  getAll: getListUsers,
  getDetail: getDetailListUser,
  add: addListUser,
  update: updateListUser,
  remove: deleteListUser,
} = listUserClient;