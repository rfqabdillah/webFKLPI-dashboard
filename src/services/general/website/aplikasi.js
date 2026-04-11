import { createCrudClient } from '@/services/baseCrud';

const aplikasiClient = createCrudClient('aplikasi', 'aplikasi');

export const {
  getAll: getAplikasi,
  getDetail: getDetailAplikasi,
  add: addAplikasi,
  update: updateAplikasi,
  remove: deleteAplikasi,
} = aplikasiClient;
