import { createCrudClient } from '@/services/baseCrud';

const linkTerkaitClient = createCrudClient('link-terkait', 'link terkait');

export const {
  getAll: getLinkTerkait,
  getDetail: getDetailLinkTerkait,
  add: addLinkTerkait,
  update: updateLinkTerkait,
  remove: deleteLinkTerkait,
} = linkTerkaitClient;
