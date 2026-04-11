import { createCrudClient } from '@/services/baseCrud';

const kategoriBeritaClient = createCrudClient('kategori-berita', 'kategori berita');

export const {
  getAll: getKategoriBerita,
  getDetail: getDetailKategoriBerita,
  add: addKategoriBerita,
  update: updateKategoriBerita,
  remove: deleteKategoriBerita,
} = kategoriBeritaClient;
