import { createCrudClient } from '@/services/baseCrud';

const userCompanyClient = createCrudClient('user-companies', 'perusahaan');

export const {
  getAll: getUserCompanies,
  getDetail: getDetailUserCompany,
  add: addUserCompany,
  update: updateUserCompany,
  remove: deleteUserCompany,
} = userCompanyClient;