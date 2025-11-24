import { createCrudClient } from '@/services/baseCrud';

const announcementClient = createCrudClient('announcements', 'pengumuman');

export const {
  getAll: getAnnouncements,
  getDetail: getDetailAnnouncement,
  add: addAnnouncement,
  update: updateAnnouncement,
  remove: deleteAnnouncement,
} = announcementClient;