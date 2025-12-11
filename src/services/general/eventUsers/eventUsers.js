import { createCrudClient } from '@/services/baseCrud';

const eventUserClient = createCrudClient('event-users', 'agenda pengguna');

export const {
  getAll: getEventUsers,
  getDetail: getDetailEventUser,
  add: addEventUser,
  update: updateEventUser,
  remove: deleteEventUser,
} = eventUserClient;