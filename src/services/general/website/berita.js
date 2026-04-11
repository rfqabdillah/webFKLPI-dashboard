import { createCrudClient } from '@/services/baseCrud';

const beritaClient = createCrudClient('berita', 'berita');

export const {
  getAll: getBerita,
  getDetail: getDetailBerita,
  add: addBerita,
  update: updateBerita,
  remove: deleteBerita,
} = beritaClient;
