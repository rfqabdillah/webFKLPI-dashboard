import { createCrudClient } from '@/services/baseCrud';

const roleClient = createCrudClient('roles', 'level');

export const {
  getAll: getRoles,
  getDetail: getDetailRole,
  add: addRole,
  update: updateRole,
  remove: deleteRole,
} = roleClient;