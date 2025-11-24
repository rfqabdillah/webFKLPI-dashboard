import { createCrudClient } from '@/services/baseCrud';

const educationLevelClient = createCrudClient('education-levels', 'jenjang pendidikan');

export const {
  getAll: getEducationLevels,
  getDetail: getDetailEducationLevel,
  add: addEducationLevel,
  update: updateEducationLevel,
  remove: deleteEducationLevel,
} = educationLevelClient;