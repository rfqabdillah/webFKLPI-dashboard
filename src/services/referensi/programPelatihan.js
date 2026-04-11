import { createCrudClient } from '@/services/baseCrud';

const programPelatihanClient = createCrudClient('program-pelatihan', 'program pelatihan');

export const {
  getAll: getProgramPelatihan,
  getDetail: getDetailProgramPelatihan,
  add: addProgramPelatihan,
  update: updateProgramPelatihan,
  remove: deleteProgramPelatihan,
} = programPelatihanClient;
