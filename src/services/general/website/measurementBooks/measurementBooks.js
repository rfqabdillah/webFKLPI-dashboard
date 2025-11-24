import { createCrudClient } from '@/services/baseCrud';

const measurementBookClient = createCrudClient('measurement-books', 'buku pengukuran');

export const {
  getAll: getMeasurementBooks,
  getDetail: getDetailMeasurementBook,
  add: addMeasurementBook,
  update: updateMeasurementBook,
  remove: deleteMeasurementBook,
} = measurementBookClient;