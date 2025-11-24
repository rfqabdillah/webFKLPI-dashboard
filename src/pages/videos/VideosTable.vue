<template>
  <BaseTable
    title="Daftar Video"
    entityName="Video"
    :apiService="videoApi"
    :FormModalComponent="VideoFormModal"
    :columns="columns"
    primaryKey="idvideo"
    deleteItemNameKey="judul"
    :initialFilters="initialFilters"
    initialSortColumn="created_at"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterName" class="form-label text-dark fw-semibold">Judul Video</label>
          <input
            type="text"
            id="filterName"
            class="form-control"
            v-model="filters.judul"
            placeholder="Masukkan judul video"
          />
        </div>
        <div class="col-md-4">
          <label for="filterStatus" class="form-label text-dark fw-semibold">Status Tayang</label>
          <select id="filterStatus" class="form-select" v-model="filters.tayang">
            <option value="">Semua Status</option>
            <option value="Tayang">Tayang</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
        <div class="col-md-4">
          <label for="filterFlash" class="form-label text-dark fw-semibold">Status Flash</label>
          <select id="filterFlash" class="form-select" v-model="filters.flash">
            <option value="">Semua</option>
            <option value="1">Aktif</option>
            <option value="0">Nonaktif</option>
          </select>
        </div>
      </div>
    </template>

    <template #cell(linkvideo)="{ value }">
      <a :href="value" target="_blank" rel="noopener noreferrer">{{ value }}</a>
    </template>

    <template #cell(tayang)="{ value }">
      <span
        class="badge"
        :class="{
          'bg-success': value === 'Tayang',
          'bg-warning': value === 'Draft',
          'bg-light text-dark': value !== 'Tayang' && value !== 'Draft'
        }"
      >
        {{ value || 'N/A' }}
      </span>
    </template>

    <template #cell(created_at)="{ value }">
      {{ formatDate(value) }}
    </template>

  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import { deleteVideo, getVideos } from '@/services/general/website/videos/videos';
import { formatDate } from '@/utils/formatDate';

const VideoFormModal = defineAsyncComponent(() => 
  import('./VideoFormModal.vue')
);

const videoApi = {
  get: getVideos,
  delete: deleteVideo,
};

const columns = [
  { key: 'judul', label: 'Judul', sortable: true },
  { key: 'linkvideo', label: 'Link Video', sortable: false },
  { key: 'tayang', label: 'Status', sortable: true },
  { key: 'deskripsi', label: 'Deskripsi', sortable: true },
];

const initialFilters = {
  judul: "",
  tayang: "",
  flash: "",
};
</script>