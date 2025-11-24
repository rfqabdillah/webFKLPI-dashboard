import { createCrudClient } from '@/services/baseCrud';

const vocationalSubfieldClient = createCrudClient('vocational-subfields', 'sub kejuruan');

export const {
  getAll: getVocationalSubfields,
  getDetail: getDetailVocationalSubfield,
  add: addVocationalSubfield,
  update: updateVocationalSubfield,
  remove: deleteVocationalSubfield,
} = vocationalSubfieldClient;