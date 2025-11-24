import apiClient from '@/services/users';

/**
 * Membuat client CRUD untuk resource tertentu.
 * @param {string} resourceName - Nama endpoint.
 * @param {string} resourceLabel - Label untuk pesan error.
 * @returns {object} - Fungsi CRUD (get, detail, add, update, delete)
 */
export const createCrudClient = (resourceName, resourceLabel) => ({
  getAll: (params = {}) =>
    apiClient.get('', { params: { act: resourceName, ...params } }),

  getDetail: (primaryId) => {
    if (!primaryId)
      return Promise.reject(new Error(`ID ${resourceLabel} tidak tersedia.`));
    return apiClient.get('', {
      params: { act: resourceName, key: primaryId },
    });
  },

  add: (data) => {
    data.append('act', resourceName);
    return apiClient.post('', data);
  },

  update: (primaryId, data) => {
    if (!primaryId)
      return Promise.reject(new Error(`ID ${resourceLabel} tidak tersedia.`));
    data.append('act', resourceName);
    data.append('key', primaryId);
    return apiClient.post('', data);
  },

  remove: (primaryId) => {
    if (!primaryId)
      return Promise.reject(new Error(`ID ${resourceLabel} tidak tersedia.`));
    return apiClient.delete('', {
      params: { act: resourceName, key: primaryId },
    });
  },
});
