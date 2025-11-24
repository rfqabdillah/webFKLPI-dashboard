<template>
  <BaseTable
    title="Daftar Status Pegawai"
    entityName="Status Pegawai" 
    :apiService="statusApi"
    :FormModalComponent="EmployeeStatusFormModal"
    :columns="columns"
    primaryKey="idstatuspegawai"
    deleteItemNameKey="namastatuspegawai"
    :initialFilters="initialFilters"
    initialSortColumn="namastatuspegawai"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterRankName" class="form-label text-dark fw-semibold">Nama Status Pegawai</label>
          <input
            type="text"
            id="filterStatusName"
            class="form-control"
            v-model="filters.namastatuspegawai"
            placeholder="Masukkan nama status"
          />
        </div>
      </div>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import { deleteEmployeeStatus, getEmployeeStatuses } from '@/services/referensi/employeeStatuses';

const EmployeeStatusFormModal = defineAsyncComponent(() => 
  import('./EmployeeStatusFormModal.vue')
);

const statusApi = {
  get: getEmployeeStatuses,
  delete: deleteEmployeeStatus,
};

const columns = [
  { key: 'namastatuspegawai', label: 'Nama Status Pegawai', sortable: true },
];

const initialFilters = {
  namastatuspegawai: "",

};
</script>
