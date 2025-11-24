<template>
  <BaseTable
    title="Daftar Jenjang Kategori"
    entityName="Jenjang Kategori" 
    :apiService="levelCategoryApi"
    :FormModalComponent="LevelCategoryFormModal"
    :columns="columns"
    primaryKey="idjenjangkategori"
    deleteItemNameKey="namajenjangkategori"
    :initialFilters="initialFilters"
    initialSortColumn="namajenjangkategori"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-3">
          <label for="filterLevelCategoryName" class="form-label text-dark fw-semibold">Jenjang Kategori</label>
          <input
            type="text"
            id="filterLevelCategoryName"
            class="form-control"
            v-model="filters.namajenjangkategori"
            placeholder="Masukkan nama jenjang kategori"
          />
        </div>
      </div>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import { deleteLevelCategory, getLevelCategories } from '@/services/referensi/levelCategories';

const LevelCategoryFormModal = defineAsyncComponent(() => 
  import('./LevelCategoriesFormModal.vue')
);

const levelCategoryApi = {
  get: getLevelCategories,
  delete: deleteLevelCategory,
};

const columns = [
  { key: 'namajenjangkategori', label: 'Nama Jenjang Kategori', sortable: true },
];

const initialFilters = {
  namajenjangkategori: "",
};
</script>
