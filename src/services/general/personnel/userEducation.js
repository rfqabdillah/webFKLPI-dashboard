import { createCrudClient } from '@/services/baseCrud';

const userEducationClient = createCrudClient('user-educations', 'pengguna-pendidikan');

export const {
  getAll: getUserEducations,
  getDetail: getDetailUserEducation,
  add: addUserEducation,
  update: updateUserEducation,
  remove: deleteUserEducation,
} = userEducationClient;