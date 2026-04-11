<template>
  <BaseTable
    title="Daftar Jenis Kelamin"
    entityName="Jenis Kelamin"
    :apiService="jenisKelaminApi"
    :FormModalComponent="JenisKelaminFormModal"
    :columns="columns"
    primaryKey="id_jenis_kelamin"
    deleteItemNameKey="nama_jenis_kelamin"
    :initialFilters="initialFilters"
    initialSortColumn="nama_jenis_kelamin"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label
            for="filterJenisKelamin"
            class="form-label text-dark fw-semibold"
            >Nama Jenis Kelamin</label
          >
          <input
            type="text"
            id="filterJenisKelamin"
            class="form-control"
            v-model="filters.nama_jenis_kelamin"
            placeholder="Masukkan jenis kelamin"
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
  deleteJenisKelamin,
  getJenisKelamin,
} from "@/services/referensi/jenisKelamin";

const JenisKelaminFormModal = defineAsyncComponent(() =>
  import("./JenisKelaminFormModal.vue"),
);

const jenisKelaminApi = {
  get: getJenisKelamin,
  delete: deleteJenisKelamin,
};

const columns = [
  {
    key: "nama_jenis_kelamin",
    label: "Jenis Kelamin",
    sortable: true,
  },
];

const initialFilters = {
  nama_jenis_kelamin: "",
};
</script>
