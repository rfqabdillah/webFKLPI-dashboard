import { createCrudClient } from '@/services/baseCrud';

const laporanClient = createCrudClient('laporan', 'laporan');

export const {
  getAll: getLaporan,
  getDetail: getDetailLaporan,
  add: addLaporan,
  update: updateLaporan,
  remove: deleteLaporan,
} = laporanClient;
