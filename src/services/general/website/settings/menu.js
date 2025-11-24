import { createCrudClient } from '@/services/baseCrud';

const menuClient = createCrudClient('menus', 'menu');

export const {
  getAll: getMenus,
  getDetail: getDetailMenu,
  add: addMenu,
  update: updateMenu,
  remove: deleteMenu,
} = menuClient;