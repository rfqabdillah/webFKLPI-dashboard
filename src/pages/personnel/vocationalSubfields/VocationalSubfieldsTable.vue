<template>
  <BaseTable
    title="Daftar Sub Kejuruan"
    entityName="Sub Kejuruan" 
    :apiService="subfieldApi"
    :FormModalComponent="VocationalSubfieldFormModal"
    :columns="columns"
    primaryKey="idsubkejuruan"
    deleteItemNameKey="namasubkejuruan"
    :initialFilters="initialFilters"
    initialSortColumn="kodesubkejuruan"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-3">
          <label for="filterVocationalCode" class="form-label text-dark fw-semibold">Kode Subkejuruan</label>
          <input
            type="text"
            id="filterVocationalCode"
            class="form-control"
            v-model="filters.kodesubkejuruan"
            placeholder="Masukkan kode sub kejuruan"
          />
        </div>
        <div class="col-md-3">
          <label for="filterVocationalName" class="form-label text-dark fw-semibold">Nama Sub Kejuruan</label>
          <input
            type="text"
            id="filterVocationalName"
            class="form-control"
            v-model="filters.namasubkejuruan"
            placeholder="Masukkan nama sub kejuruan"
          />
        </div>
        <div class="col-md-3">
          <label for="filterParentName" class="form-label text-dark fw-semibold">Nama Kejuruan</label>
          <input
            type="text"
            id="filterParentName"
            class="form-control"
            v-model="filters.namakejuruan" 
            placeholder="Masukkan nama kejuruan"
          />
        </div>
      </div>
    </template>

    <template #cell(namakejuruan)="{ item }">
      {{ item['vocational-fields']?.namakejuruan || '-' }}
    </template>

  </BaseTable>
</template>

<script setup>
import { deleteVocationalSubfield, getVocationalSubfields } from '@/services/referensi/vocationalSubfields';
import { defineAsyncComponent } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';

const VocationalSubfieldFormModal = defineAsyncComponent(() => 
  import('./VocationalSubfieldFormModal.vue')
);

const subfieldApi = {
  get: getVocationalSubfields,
  delete: deleteVocationalSubfield,
};

const columns = [
  { key: 'kodesubkejuruan', label: 'Kode Sub Kejuruan', sortable: true },
  { key: 'namasubkejuruan', label: 'Nama Sub Kejuruan', sortable: true },
  { key: 'namakejuruan', label: 'Nama Kejuruan', sortable: true }, 
];

const initialFilters = {
  kodesubkejuruan: "",
  namasubkejuruan: "",
  namakejuruan: "", 
};
</script>