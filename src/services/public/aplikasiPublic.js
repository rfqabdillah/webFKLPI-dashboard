import { createCrudClient } from '@/services/baseCrud';

const aplikasiClient = createCrudClient('pub-aplikasi', 'aplikasi');

export const {
  getAll: getAplikasi,
  getDetail: getDetailAplikasi,
} = aplikasiClient;