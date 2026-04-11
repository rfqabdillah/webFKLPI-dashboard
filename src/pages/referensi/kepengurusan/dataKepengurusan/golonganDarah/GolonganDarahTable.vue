<template>
  <BaseTable
    title="Daftar Golongan Darah"
    entityName="Golongan Darah"
    :apiService="golonganDarahApi"
    :FormModalComponent="GolonganDarahFormModal"
    :columns="columns"
    primaryKey="id_golongan_darah"
    deleteItemNameKey="golongan_darah"
    :initialFilters="initialFilters"
    initialSortColumn="golongan_darah"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label
            for="filterGolonganDarah"
            class="form-label text-dark fw-semibold"
            >Nama Golongan Darah</label
          >
          <input
            type="text"
            id="filterGolonganDarah"
            class="form-control"
            v-model="filters.golongan_darah"
            placeholder="Masukkan golongan darah"
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
  deleteGolonganDarah,
  getGolonganDarah,
} from "@/services/referensi/golonganDarah";

const GolonganDarahFormModal = defineAsyncComponent(() =>
  import("./GolonganDarahFormModal.vue"),
);

const golonganDarahApi = {
  get: getGolonganDarah,
  delete: deleteGolonganDarah,
};

const columns = [
  {
    key: "golongan_darah",
    label: "Golongan Darah",
    sortable: true,
  },
];

const initialFilters = {
  golongan_darah: "",
};
</script>
