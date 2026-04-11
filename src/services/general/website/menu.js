import { createCrudClient } from '@/services/baseCrud';

const menuClient = createCrudClient('menu', 'menu');

export const {
  getAll: getMenus,
  getDetail: getDetailMenu,
  add: addMenu,
  update: updateMenu,
  remove: deleteMenu,
} = menuClient;
