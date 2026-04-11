<template>
  <BaseTable
    title="Daftar Jenis Pembinaan"
    entityName="Jenis Pembinaan"
    :apiService="jenisPembinaanApi"
    :FormModalComponent="JenisPembinaanFormModal"
    :columns="columns"
    primaryKey="id_jenis_pembinaan"
    deleteItemNameKey="nama_jenis_pembinaan"
    :initialFilters="initialFilters"
    initialSortColumn="nama_jenis_pembinaan"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label
            for="filterNamaJenisPembinaan"
            class="form-label text-dark fw-semibold"
            >Jenis Pembinaan</label
          >
          <input
            type="text"
            id="filterNamaJenisPembinaan"
            class="form-control"
            v-model="filters.nama_jenis_pembinaan"
            placeholder="Masukkan jenis pembinaan"
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
  deleteJenisPembinaan,
  getJenisPembinaan,
} from "@/services/referensi/jenisPembinaan";

const JenisPembinaanFormModal = defineAsyncComponent(() =>
  import("./JenisPembinaanFormModal.vue"),
);

const jenisPembinaanApi = {
  get: getJenisPembinaan,
  delete: deleteJenisPembinaan,
};

const columns = [
  { key: "nama_jenis_pembinaan", label: "Jenis Pembinaan", sortable: true },
];

const initialFilters = {
  nama_jenis_pembinaan: "",
};
</script>
