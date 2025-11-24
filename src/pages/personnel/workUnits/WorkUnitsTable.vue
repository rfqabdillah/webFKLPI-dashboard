<template>
  <BaseTable
    title="Daftar Unit Kerja"
    entityName="Unit Kerja" 
    :apiService="rankApi"
    :FormModalComponent="WorkUnitFormModal"
    :columns="columns"
    primaryKey="idunitkerja"
    deleteItemNameKey="namaunitkerja"
    :initialFilters="initialFilters"
    initialSortColumn="namaunitkerja"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterWorkUnitName" class="form-label text-dark fw-semibold">Unit Kerja</label>
          <input
            type="text"
            id="filterWorkUnitName"
            class="form-control"
            v-model="filters.namaunitkerja"
            placeholder="Masukkan nama unit kerja"
          />
        </div>
      </div>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import { deleteWorkUnit, getWorkUnits } from '@/services/referensi/workUnits';

const WorkUnitFormModal = defineAsyncComponent(() => 
  import('./WorkUnitFormModal.vue')
);

const rankApi = {
  get: getWorkUnits,
  delete: deleteWorkUnit,
};

const columns = [
  { key: 'namaunitkerja', label: 'Nama Unit Kerja', sortable: true },
  { key: 'alamatunitkerja', label: 'Alamat Unit Kerja', sortable: false },
  { key: 'kodepropinsi', label: 'Kode Provinsi', sortable: true },
  { key: 'kodekabupaten', label: 'Kode Kabupaten', sortable: true },
];

const initialFilters = {
  namaunitkerja: "",
  alamatunitkerja: "",
  kodepropinsi: "",
  kodekabupaten: "",
};
</script>
