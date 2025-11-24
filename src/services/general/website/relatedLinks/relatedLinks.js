import { createCrudClient } from '@/services/baseCrud';

const relatedLinkClient = createCrudClient('related-links', 'link terkait');

export const {
  getAll: getRelatedLinks,
  getDetail: getDetailRelatedLink,
  add: addRelatedLink,
  update: updateRelatedLink,
  remove: deleteRelatedLink,
} = relatedLinkClient;