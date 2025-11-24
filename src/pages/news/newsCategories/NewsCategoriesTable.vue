<template>
  <BaseTable
    title="Daftar Kategori Berita"
    entityName="Kategori Berita" 
    :apiService="categoryApi"
    :FormModalComponent="NewsCategoryFormModal"
    :columns="columns"
    primaryKey="idkategoriberita"
    deleteItemNameKey="namakategoriberita"
    :initialFilters="initialFilters"
    initialSortColumn="namakategoriberita"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterNamaKategori" class="form-label text-dark fw-semibold">Nama Kategori</label>
          <input
            type="text"
            id="filterNamaKategori"
            class="form-control"
            v-model="filters.namakategoriberita"
            placeholder="Masukkan nama kategori"
          />
        </div>
        </div>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import { deleteNewsCategory, getNewsCategories } from '@/services/general/website/news/newsCategories';

const NewsCategoryFormModal = defineAsyncComponent(() => 
  import('./NewsCategoryFormModal.vue') 
);

const categoryApi = {
  get: getNewsCategories,     
  delete: deleteNewsCategory, 
};

const columns = [
  { key: 'namakategoriberita', label: 'Nama Kategori (ID)', sortable: true },
  { key: 'namakategoriberita_en', label: 'Nama Kategori (EN)', sortable: true },
  { key: 'slug', label: 'Slug', sortable: true },
];

const initialFilters = {
  namakategoriberita: "",
};
</script>