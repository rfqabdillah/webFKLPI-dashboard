import { createCrudClient } from '@/services/baseCrud';

const kategoriAgendaClient = createCrudClient('kategori-agenda', 'kategori agenda');

export const {
  getAll: getKategoriAgenda,
  getDetail: getDetailKategoriAgenda,
  add: addKategoriAgenda,
  update: updateKategoriAgenda,
  remove: deleteKategoriAgenda,
} = kategoriAgendaClient;
