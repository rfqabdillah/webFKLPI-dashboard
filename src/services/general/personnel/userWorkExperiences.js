import { createCrudClient } from '@/services/baseCrud';

const userWorkExperienceClient = createCrudClient('user-work-experiences', 'pengalaman kerja');

export const {
  getAll: getUserWorkExperiences,
  getDetail: getDetailUserWorkExperience,
  add: addUserWorkExperience,
  update: updateUserWorkExperience,
  remove: deleteUserWorkExperience,
} = userWorkExperienceClient;