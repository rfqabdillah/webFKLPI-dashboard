<template>
  <BaseTable
    title="Daftar Status Pengurus"
    entityName="Status Pengurus"
    :apiService="statusApi"
    :FormModalComponent="StatusPengurusFormModal"
    :columns="columns"
    primaryKey="id_status_pengurus"
    deleteItemNameKey="nama_status_pengurus"
    :initialFilters="initialFilters"
    initialSortColumn="nama_status_pengurus"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterStatusName" class="form-label text-dark fw-semibold"
            >Nama Status Pengurus</label
          >
          <input
            type="text"
            id="filterStatusName"
            class="form-control"
            v-model="filters.nama_status_pengurus"
            placeholder="Masukkan nama status"
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
  deleteStatusPengurus,
  getStatusPengurus,
} from "@/services/referensi/statusPengurus";

const StatusPengurusFormModal = defineAsyncComponent(() =>
  import("./StatusPengurusFormModal.vue"),
);

const statusApi = {
  get: getStatusPengurus,
  delete: deleteStatusPengurus,
};

const columns = [
  {
    key: "nama_status_pengurus",
    label: "Nama Status Pengurus",
    sortable: true,
  },
];

const initialFilters = {
  nama_status_pengurus: "",
};
</script>
