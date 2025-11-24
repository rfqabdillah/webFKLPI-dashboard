import { createCrudClient } from '@/services/baseCrud';

const userAchievementClient = createCrudClient('user-achievements', 'pengguna prestasi');

export const {
  getAll: getUserAchievements,
  getDetail: getDetailUserAchievement,
  add: addUserAchievement,
  update: updateUserAchievement,
  remove: deleteUserAchievement,
} = userAchievementClient;