<template>
  <BaseTable
    title="Daftar Galeri"
    entityName="Galeri"
    :apiService="galeryApi"
    :FormModalComponent="GalleryFormModal"
    :columns="columns"
    primaryKey="idgaleri"
    deleteItemNameKey="judul"
    :initialFilters="initialFilters"
    initialSortColumn="created_at"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterGalleryTitle" class="form-label text-dark fw-semibold"
            >Judul</label
          >
          <input
            type="text"
            id="filterGalleryTitle"
            class="form-control"
            v-model="filters.judul"
            placeholder="Masukkan judul"
          />
        </div>

        <div class="col-md-4">
          <label for="filterStatusTayang" class="form-label text-dark fw-semibold"
            >Status Tayang</label
          >
          <select
            id="filterStatusTayang"
            class="form-select"
            v-model="filters.tayang"
          >
            <option value="">Semua Status</option>
            <option value="Tayang">Tayang</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>
    </template>

    <template #cell(tayang)="{ value }">
      <span :class="value === 'Tayang' ? 'badge bg-success' : 'badge bg-warning'">
        {{ value }}
      </span>
    </template>
  </BaseTable>

</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import { deleteGallery, getGallery } from '@/services/general/website/gallery/gallery';

const GalleryFormModal = defineAsyncComponent(() =>
  import('./GalleryFormModal.vue')
);

const galeryApi = {
  get: getGallery,
  delete: deleteGallery,
};

const columns = [
  { key: 'judul', label: 'Judul', sortable: true },
  { key: 'deskripsi', label: 'Deskripsi', sortable: false },
  { key: 'tayang', label: 'Status', sortable: true },
];

const initialFilters = {
  judul: "",
  tayang: "",
};

</script>