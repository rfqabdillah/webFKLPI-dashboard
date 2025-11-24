import { createCrudClient } from '@/services/baseCrud';

const eventClient = createCrudClient('events', 'kegiatan');

export const {
  getAll: getEvents,
  getDetail: getDetailEvent,
  add: addEvent,
  update: updateEvent,
  remove: deleteEvent,
} = eventClient;