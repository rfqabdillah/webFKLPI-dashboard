<template>
  <BaseTable
    title="Daftar Jenis Lembaga"
    entityName="Jenis Lembaga"
    :apiService="jenisLembagaApi"
    :FormModalComponent="JenisLembagaFormModal"
    :columns="columns"
    primaryKey="id_jenis_lembaga"
    deleteItemNameKey="nama_jenis_lembaga"
    :initialFilters="initialFilters"
    initialSortColumn="nama_jenis_lembaga"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label
            for="filterJenisLembaga"
            class="form-label text-dark fw-semibold"
            >Nama Jenis Lembaga</label
          >
          <input
            type="text"
            id="filterJenisLembaga"
            class="form-control"
            v-model="filters.nama_jenis_lembaga"
            placeholder="Masukkan nama jenis lembaga"
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
  deleteJenisLembaga,
  getJenisLembaga,
} from "@/services/referensi/jenisLembaga";

const JenisLembagaFormModal = defineAsyncComponent(() =>
  import("./JenisLembagaFormModal.vue"),
);

const jenisLembagaApi = {
  get: getJenisLembaga,
  delete: deleteJenisLembaga,
};

const columns = [
  {
    key: "nama_jenis_lembaga",
    label: "Jenis Lembaga",
    sortable: true,
  },
];

const initialFilters = {
  nama_jenis_lembaga: "",
};
</script>
