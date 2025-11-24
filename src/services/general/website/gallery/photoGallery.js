import { createCrudClient } from '@/services/baseCrud';

const photoGalleryClient = createCrudClient('photo-gallery', 'galeri foto');

export const {
  getAll: getPhotoGallery,
  getDetail: getDetailPhotoGallery,
  add: addPhotoGallery,
  update: updatePhotoGallery,
  remove: deletePhotoGallery,
} = photoGalleryClient;