import { createCrudClient } from '@/services/baseCrud';

const bannerClient = createCrudClient('banner', 'banner');

export const {
  getAll: getBanner,
  getDetail: getDetailBanner,
  add: addBanner,
  update: updateBanner,
  remove: deleteBanner,
} = bannerClient;
