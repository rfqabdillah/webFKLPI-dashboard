import { createCrudClient } from '@/services/baseCrud';

const faqClient = createCrudClient('faq', 'faq');

export const {
  getAll: getFaq,
  getDetail: getDetailFaq,
  add: addFaq,
  update: updateFaq,
  remove: deleteFaq,
} = faqClient;
