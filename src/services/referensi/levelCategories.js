import { createCrudClient } from '@/services/baseCrud';

const levelCategoryClient = createCrudClient('level-categories', 'jenjang kategori');

export const {
  getAll: getLevelCategories,
  getDetail: getDetailLevelCategory,
  add: addLevelCategory,
  update: updateLevelCategory,
  remove: deleteLevelCategory,
} = levelCategoryClient;
