import { createCrudClient } from '@/services/baseCrud';

const galleryClient = createCrudClient('gallery', 'galeri');

export const {
  getAll: getGallery,
  getDetail: getDetailGallery,
  add: addGallery,
  update: updateGallery,
  remove: deleteGallery,
} = galleryClient;