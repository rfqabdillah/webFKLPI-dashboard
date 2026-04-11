<template>
  <BaseTable
    title="Daftar Metode Pembinaan"
    entityName="Metode Pembinaan"
    :apiService="metodePembinaanApi"
    :FormModalComponent="MetodePembinaanFormModal"
    :columns="columns"
    primaryKey="id_metode_pembinaan"
    deleteItemNameKey="nama_metode_pembinaan"
    :initialFilters="initialFilters"
    initialSortColumn="nama_metode_pembinaan"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label
            for="filterNamaMetodePembinaan"
            class="form-label text-dark fw-semibold"
            >Metode Pembinaan</label
          >
          <input
            type="text"
            id="filterNamaMetodePembinaan"
            class="form-control"
            v-model="filters.nama_metode_pembinaan"
            placeholder="Masukkan metode pembinaan"
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
  deleteMetodePembinaan,
  getMetodePembinaan,
} from "@/services/referensi/metodePembinaan";

const MetodePembinaanFormModal = defineAsyncComponent(() =>
  import("./MetodePembinaanFormModal.vue"),
);

const metodePembinaanApi = {
  get: getMetodePembinaan,
  delete: deleteMetodePembinaan,
};

const columns = [
  { key: "nama_metode_pembinaan", label: "Metode Pembinaan", sortable: true },
];

const initialFilters = {
  nama_metode_pembinaan: "",
};
</script>
