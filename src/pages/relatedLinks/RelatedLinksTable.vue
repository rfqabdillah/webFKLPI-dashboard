<template>
  <BaseTable
    title="Daftar Link Terkait"
    entityName="Link Terkait" 
    :apiService="relatedLinkApi"
    :FormModalComponent="RelatedLinkFormModal"
    :columns="columns"
    primaryKey="idlinkterkait"
    deleteItemNameKey="nama"
    :initialFilters="initialFilters"
    initialSortColumn="nama"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterName" class="form-label text-dark fw-semibold">Nama Link</label>
          <input
            type="text"
            id="filterName"
            class="form-control"
            v-model="filters.nama"
            placeholder="Masukkan nama link"
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
      </div>
    </template>

    <template #cell(logo)="{ value }">
      <img 
        v-if="value" 
        :src="value" 
        alt="Logo" 
        style="width: 70px; height: auto; object-fit: contain; border-radius: 4px;"
        onerror="this.src='https://placehold.co/100x40/EBF4FF/7F9CF5?text=Logo'"
      >
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(link)="{ value }">
      <a :href="value" target="_blank" rel="noopener noreferrer">{{ value }}</a>
    </template>

    <template #cell(target)="{ value }">
      <span v-if="value === '_blank'">Tab Baru</span>
      <span v-else-if="value === '_self'">Tab Ini</span>
      <span v-else class="text-muted">{{ value || '-' }}</span>
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
import { deleteRelatedLink, getRelatedLinks } from '@/services/general/website/relatedLinks/relatedLinks';
import { formatDate } from '@/utils/formatDate';

const RelatedLinkFormModal = defineAsyncComponent(() => 
  import('./RelatedLinkFormModal.vue')
);

const relatedLinkApi = {
  get: getRelatedLinks,
  delete: deleteRelatedLink,
};

const columns = [
  { key: 'logo', label: 'Logo', sortable: false },
  { key: 'nama', label: 'Nama Link', sortable: true },
  { key: 'link', label: 'URL', sortable: false },
  { key: 'target', label: 'Target', sortable: true },
  { key: 'tayang', label: 'Status', sortable: true },
  { key: 'created_at', label: 'Dibuat', sortable: true },
];

const initialFilters = {
  nama: "",
  tayang: "",
};
</script>