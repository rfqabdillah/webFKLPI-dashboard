import { createCrudClient } from '@/services/baseCrud';

const genderClient = createCrudClient('genders', 'jenis kelamin');

export const {
  getAll: getGenders,
  getDetail: getDetailGender,
  add: addGender,
  update: updateGender,
  remove: deleteGender,
} = genderClient;