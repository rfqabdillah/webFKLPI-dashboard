import { createCrudClient } from '@/services/baseCrud';

const videoCategoryClient = createCrudClient('video-categories', 'kategori video');

export const {
  getAll: getVideoCategories,
  getDetail: getDetailVideoCategory,
  add: addVideoCategory,
  update: updateVideoCategory,
  remove: deleteVideoCategory,
} = videoCategoryClient;