import { createCrudClient } from '@/services/baseCrud';

const bannerClient = createCrudClient('banners', 'banner');

export const {
  getAll: getBanners,
  getDetail: getDetailBanner,
  add: addBanner,
  update: updateBanner,
  remove: deleteBanner,
} = bannerClient;