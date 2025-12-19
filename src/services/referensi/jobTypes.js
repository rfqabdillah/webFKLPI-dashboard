import { createCrudClient } from '@/services/baseCrud';

const jobTypeClient = createCrudClient('job-types', 'jenis pekerjaan');

export const {
  getAll: getJobTypes,
  getDetail: getDetailJobType,
  add: addJobType,
  update: updateJobType,
  remove: deleteJobType,
} = jobTypeClient;