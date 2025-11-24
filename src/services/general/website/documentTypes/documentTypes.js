import { createCrudClient } from '@/services/baseCrud';

const documentTypeClient = createCrudClient('document-types', 'dokumen');

export const {
  getAll: getDocumentTypes,
  getDetail: getDetailDocumentType,
  add: addDocumentType,
  update: updateDocumentType,
  remove: deleteDocumentType,
} = documentTypeClient;