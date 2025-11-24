import { createCrudClient } from '@/services/baseCrud';

const videoClient = createCrudClient('videos', 'video');

export const {
  getAll: getVideos,
  getDetail: getDetailVideo,
  add: addVideo,
  update: updateVideo,
  remove: deleteVideo,
} = videoClient;