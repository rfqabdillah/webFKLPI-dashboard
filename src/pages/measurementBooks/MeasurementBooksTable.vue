<template>
  <BaseTable
    title="Daftar Dokumen"
    entityName="Dokumen" 
    :apiService="measurementBookApi"
    :FormModalComponent="MeasurementBookFormModal"
    :DetailModalComponent="MeasurementBookDetailModal"
    :columns="columns"
    primaryKey="idbukupengukuran"
    deleteItemNameKey="judul"
    :initialFilters="initialFilters"
    initialSortColumn="judul"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-3">
          <label for="filterJudul" class="form-label text-dark fw-semibold">Judul</label>
          <input
            type="text"
            id="filterJudul"
            class="form-control"
            v-model="filters.judul"
            placeholder="Masukkan judul buku" /> 
        </div>
        <div class="col-md-3">
          <label for="filterJudul" class="form-label text-dark fw-semibold">Jenis Dokumen</label>
          <input
            type="text"
            id="filterjenis"
            class="form-control"
            v-model="filters.namajenisdokumen"
            placeholder="Masukkan jenis dokumen" /> 
        </div>
        <div class="col-md-3">
          <label for="filterTahun" class="form-label text-dark fw-semibold">Tahun</label>
          <input
            type="number"
            id="filterTahun"
            class="form-control"
            v-model="filters.tahun"
            placeholder="Masukkan tahun" />
        </div>
        <div class="col-md-3">
          <label for="filterStatus" class="form-label text-dark fw-semibold">Status Tayang</label>
          <select id="filterStatus" class="form-select" v-model="filters.tayang">
            <option value="">Semua Status</option>
            <option value="Tayang">Tayang</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>
    </template>

    <template #cell(namajenisdokumen)="{ item }">
      <span v-if="item['document-types']">
        {{ item['document-types'].namajenisdokumen || '-' }}
      </span>
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(dokumen)="{ value }">
      <a 
        v-if="value" 
        :href="value" 
        target="_blank" 
        class="btn btn-sm btn-outline-primary"
        title="Lihat Dokumen"
      >
        <i class="fa fa-file-pdf-o"></i>
      </a>
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(created_at)="{ value }">
      {{ formatDate(value) }}
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
import { deleteMeasurementBooks, getMeasurementBooks } from '@/services/general/website/measurementBooks/measurementBooks';

const MeasurementBookFormModal = defineAsyncComponent(() => 
  import('./MeasurementBookFormModal.vue')
);
const MeasurementBookDetailModal = defineAsyncComponent(() =>
  import('./MeasurementBookDetailModal.vue')
);

const measurementBookApi = {
  get: getMeasurementBooks,
  delete: deleteMeasurementBooks,
};

const columns = [
  { key: 'judul', label: 'Judul', sortable: true },
  { key: 'namajenisdokumen', label: 'Jenis Dokumen', sortable: true },
  { key: 'dokumen', label: 'Dokumen', sortable: false },
  { key: 'tahun', label: 'Tahun', sortable: true },
  { key: 'tayang', label: 'Status', sortable: true },
];

const initialFilters = {
  judul: "",
  namajenisdokumen: "",
  tayang: "",
  tahun: "", 
  flash: "", 
};
</script>