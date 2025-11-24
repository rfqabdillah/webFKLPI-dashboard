<template>
  <BaseTable
    title="Daftar Jenjang Pendidikan"
    entityName="Jenjang Pendidikan" 
    :apiService="rankApi"
    :FormModalComponent="EducationLevelFormModal"
    :columns="columns"
    primaryKey="idjenjangpendidikan"
    deleteItemNameKey="namajenjangpendidikan"
    :initialFilters="initialFilters"
    initialSortColumn="namajenjangpendidikan"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterEducationLevelName" class="form-label text-dark fw-semibold">Jenjang Pendidikan</label>
          <input
            type="text"
            id="filterEducationLevelName"
            class="form-control"
            v-model="filters.namajenjangpendidikan"
            placeholder="Masukkan nama jenjang pendidikan"
          />
        </div>
      </div>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import { deleteEducationLevel, getEducationLevels } from '@/services/referensi/educationLevels';

const EducationLevelFormModal = defineAsyncComponent(() => 
  import('./EducationLevelFormModal.vue')
);

const rankApi = {
  get: getEducationLevels,
  delete: deleteEducationLevel,
};

const columns = [
  { key: 'namajenjangpendidikan', label: 'Nama Jenjang Pendidikan', sortable: true },
];

const initialFilters = {
  namajenjangpendidikan: "",
};
</script>
