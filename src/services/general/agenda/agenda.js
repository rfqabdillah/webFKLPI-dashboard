import { createCrudClient } from '@/services/baseCrud';

const agendaClient = createCrudClient('agenda', 'agenda');

export const {
  getAll: getAgenda,
  getDetail: getDetailAgenda,
  add: addAgenda,
  update: updateAgenda,
  remove: deleteAgenda,
} = agendaClient;
