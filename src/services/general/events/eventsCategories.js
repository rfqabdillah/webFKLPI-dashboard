import { createCrudClient } from '@/services/baseCrud';

const eventCategoryClient = createCrudClient('event-categories', 'kategori kegiatan');

export const {
  getAll: getEventCategories,
  getDetail: getDetailEventCategory,
  add: addEventCategory,
  update: updateEventCategory,
  remove: deleteEventCategory,
} = eventCategoryClient;
