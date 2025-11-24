<template>
  <BaseTable
    title="Daftar Berita"
    entityName="Berita" 
    :apiService="newsApi"
    :FormModalComponent="NewsFormModal"
    :DetailModalComponent="NewsDetailModal"
    :columns="columns"
    primaryKey="idberita"
    deleteItemNameKey="judul"
    :initialFilters="initialFilters"
    initialSortColumn="judul"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterJudul" class="form-label text-dark fw-semibold">Judul</label>
          <input
            type="text"
            id="filterJudul"
            class="form-control"
            v-model="filters.judul"
            placeholder="Masukkan judul berita" />
        </div>
        <div class="col-md-4">
          <label for="filterKategoriBerita" class="form-label text-dark fw-semibold">Kategori Berita</label>
          <input
            type="text"
            id="filterKategoriBerita"
            class="form-control"
            v-model="filters.namakategoriberita" placeholder="Masukkan Kategori Berita" />
        </div>
        <div class="col-md-4">
          <label for="filterStatus" class="form-label text-dark fw-semibold">Status Tayang</label>
          <select id="filterStatus" class="form-select" v-model="filters.tayang">
            <option value="">Semua Status</option>
            <option value="Tayang">Tayang</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>
    </template>

    <template #cell(created_at)="{ value }">
      {{ formatDate(value) }}
    </template>
    
    <template #cell(namakategoriberita)="{ item }">
      <span v-if="item['news-categories']">
        {{ item['news-categories'].namakategoriberita }}
      </span>
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(nama)="{ item }">
      <span v-if="item.users">
        {{ item.users.nama }}
      </span>
      <span v-else class="text-muted">-</span>
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
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import { formatDate } from '@/utils/formatDate'
import { deleteNews, getNews } from '@/services/general/website/news/news';

const NewsFormModal = defineAsyncComponent(() => 
  import('./NewsFormModal.vue')
);
const NewsDetailModal = defineAsyncComponent(() =>
  import('./NewsDetailModal.vue')
);

const newsApi = {
  get: getNews,
  delete: deleteNews,
};

const columns = [
  { key: 'judul', label: 'Judul', sortable: true },
  { key: 'namakategoriberita', label: 'Kategori Berita', sortable: true }, 
  { key: 'nama', label: 'Penulis', sortable: true }, 
  { key: 'created_at', label: 'Tanggal Dibuat', sortable: true }, 
  { key: 'tayang', label: 'Status', sortable: true },
];

const initialFilters = {
  judul: "",
  namakategoriberita: "", 
  tayang: "",
};
</script>