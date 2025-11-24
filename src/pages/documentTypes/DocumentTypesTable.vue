<template>
  <BaseTable
    title="Daftar Jenis Dokumen"
    entityName="Jenis Dokumen" 
    :apiService="documentTypeApi"
    :FormModalComponent="DocumentTypeFormModal"
    :columns="columns"
    primaryKey="idjenisdokumen"
    deleteItemNameKey="namajenisdokumen"
    :initialFilters="initialFilters"
    initialSortColumn="namajenisdokumen"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterJenisDokumen" class="form-label text-dark fw-semibold">Nama Jenis Dokumen</label>
          <input
            type="text"
            id="filterJenisDokumen"
            class="form-control"
            v-model="filters.namajenisdokumen"
            placeholder="Masukkan nama jenis dokumen"
          />
        </div>
        </div>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import { deleteDocumentType, getDocumentTypes } from '@/services/general/website/documentTypes/documentTypes';

const DocumentTypeFormModal = defineAsyncComponent(() => 
  import('./DocumentTypeFormModal.vue') 
);

const documentTypeApi = {
  get: getDocumentTypes,     
  delete: deleteDocumentType, 
};

const columns = [
  { key: 'namajenisdokumen', label: 'Jenis Dokumen', sortable: true },
];

const initialFilters = {
  namajenisdokumen: "",
};
</script>