import { createCrudClient } from '@/services/baseCrud';

const eventClient = createCrudClient('agenda-public', 'agenda');

export const {
  getAll: getEvents,
  getDetail: getDetailEvent,
} = eventClient;