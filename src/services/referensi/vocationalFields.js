import { createCrudClient } from '@/services/baseCrud';

const vocationalFieldClient = createCrudClient('vocational-fields', 'kejuruan');

export const {
  getAll: getVocationalFields,
  getDetail: getDetailVocationalField,
  add: addVocationalField,
  update: updateVocationalField,
  remove: deleteVocationalField,
} = vocationalFieldClient;