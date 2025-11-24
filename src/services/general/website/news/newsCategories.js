import { createCrudClient } from '@/services/baseCrud';

const newsCategoryClient = createCrudClient('news-categories', 'kategori berita');

export const {
  getAll: getNewsCategories,
  getDetail: getDetailNewsCategory,
  add: addNewsCategory,
  update: updateNewsCategory,
  remove: deleteNewsCategory,
} = newsCategoryClient;