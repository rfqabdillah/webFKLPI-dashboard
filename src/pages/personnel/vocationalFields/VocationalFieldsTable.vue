<template>
  <BaseTable
    title="Daftar Kejuruan"
    entityName="Kejuruan" 
    :apiService="vocationalApi"
    :FormModalComponent="VocationalFieldFormModal"
    :columns="columns"
    primaryKey="idkejuruan"
    deleteItemNameKey="namakejuruan"
    :initialFilters="initialFilters"
    initialSortColumn="kodekejuruan"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-3">
          <label for="filterVocationalCode" class="form-label text-dark fw-semibold">Kode Kejuruan</label>
          <input
            type="text"
            id="filterVocationalCode"
            class="form-control"
            v-model="filters.kodekejuruan"
            placeholder="Masukkan kode kejuruan"
          />
        </div>
        <div class="col-md-3">
          <label for="filterVocationalName" class="form-label text-dark fw-semibold">Nama Kejuruan</label>
          <input
            type="text"
            id="filterVocationalName"
            class="form-control"
            v-model="filters.namakejuruan"
            placeholder="Masukkan nama kejuruan"
          />
        </div>
      </div>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import { getVocationalFields, deleteVocationalField } from "@/services/referensi/vocationalFields";
import BaseTable from '@/components/base/BaseTable.vue';

const VocationalFieldFormModal = defineAsyncComponent(() => 
  import('./VocationalFieldFormModal.vue')
);

const vocationalApi = {
  get: getVocationalFields,
  delete: deleteVocationalField,
};

const columns = [
  { key: 'kodekejuruan', label: 'Kode Kejuruan', sortable: true },
  { key: 'namakejuruan', label: 'Nama Kejuruan', sortable: true },
];

const initialFilters = {
  kodekejuruan: "",
  namakejuruan: "",
};
</script>
