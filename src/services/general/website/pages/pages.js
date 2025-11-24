import { createCrudClient } from '@/services/baseCrud';

const pageClient = createCrudClient('pages', 'halaman');

export const {
  getAll: getPages,
  getDetail: getDetailPage,
  add: addPage,
  update: updatePage,
  remove: deletePage,
} = pageClient;