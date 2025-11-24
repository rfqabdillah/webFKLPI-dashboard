import { createCrudClient } from '@/services/baseCrud';

const userTrainingClient = createCrudClient('user-trainings', 'pengguna pelatihan');

export const {
  getAll: getUserTrainings,
  getDetail: getDetailUserTraining,
  add: addUserTraining,
  update: updateUserTraining,
  remove: deleteUserTraining,
} = userTrainingClient;