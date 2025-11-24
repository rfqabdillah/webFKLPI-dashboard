import { createCrudClient } from '@/services/baseCrud';

const newsClient = createCrudClient('news', 'berita');

export const {
  getAll: getNews,
  getDetail: getDetailNews,
  add: addNews,
  update: updateNews,
  remove: deleteNews,
} = newsClient;