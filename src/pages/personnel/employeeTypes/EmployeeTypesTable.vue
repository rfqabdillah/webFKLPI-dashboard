<template>
  <BaseTable
    title="Daftar Profesi"
    entityName="Profesi"
    :apiService="statusApi"
    :FormModalComponent="EmployeeTypeFormModal"
    :columns="columns"
    primaryKey="idjenispegawai"
    deleteItemNameKey="namajenispegawai"
    :initialFilters="initialFilters"
    initialSortColumn="namajenispegawai"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterRankName" class="form-label text-dark fw-semibold"
            >Nama Profesi</label
          >
          <input
            type="text"
            id="filterTypesName"
            class="form-control"
            v-model="filters.namajenispegawai"
            placeholder="Masukkan profesi"
          />
        </div>
      </div>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";
import {
  deleteEmployeeType,
  getEmployeeTypes,
} from "@/services/referensi/employeeTypes";

const EmployeeTypeFormModal = defineAsyncComponent(() =>
  import("./EmployeeTypeFormModal.vue")
);

const statusApi = {
  get: getEmployeeTypes,
  delete: deleteEmployeeType,
};

const columns = [{ key: "namajenispegawai", label: "Profesi", sortable: true }];

const initialFilters = {
  namajenispegawai: "",
};
</script>
