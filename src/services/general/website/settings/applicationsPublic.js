import { createCrudClient } from '@/services/baseCrud';

const applicationPubClient = createCrudClient('application-public', 'aplikasi');

export const {
  getAll: getApplicationPub,
  getDetail: getDetailApplicationPub,
} = applicationPubClient;