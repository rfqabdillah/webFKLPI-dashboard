<template>
  <BaseTable
    title="Daftar Wilayah"
    entityName="Wilayah"
    :apiService="wilayahApi"
    :FormModalComponent="WilayahFormModal"
    :columns="columns"
    primaryKey="id_wilayah"
    deleteItemNameKey="nama_wilayah"
    :initialFilters="initialFilters"
    initialSortColumn="nama_wilayah"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-3">
          <label
            for="filterKodeWilayah"
            class="form-label text-dark fw-semibold"
            >Kode Wilayah</label
          >
          <input
            type="text"
            id="filterKodeWilayah"
            class="form-control"
            v-model="filters.kode_wilayah"
            placeholder="Cari kode wilayah"
          />
        </div>
        <div class="col-md-3">
          <label
            for="filterNamaWilayah"
            class="form-label text-dark fw-semibold"
            >Nama Wilayah</label
          >
          <input
            type="text"
            id="filterNamaWilayah"
            class="form-control"
            v-model="filters.nama_wilayah"
            placeholder="Cari nama wilayah"
          />
        </div>
        <div class="col-md-3">
          <label
            for="filterTipeWilayah"
            class="form-label text-dark fw-semibold"
            >Tipe Wilayah</label
          >
          <select
            id="filterTipeWilayah"
            class="form-select"
            v-model="filters.tipe_wilayah"
          >
            <option value="">Semua Tipe</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
      </div>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";
import { getWilayah, deleteWilayah } from "@/services/referensi/wilayah";

const WilayahFormModal = defineAsyncComponent(() =>
  import("./WilayahFormModal.vue"),
);

const wilayahApi = {
  get: getWilayah,
  delete: deleteWilayah,
};

const columns = [
  { key: "kode_wilayah", label: "Kode Wilayah", sortable: true },
  { key: "nama_wilayah", label: "Nama Wilayah", sortable: true },
  { key: "tipe_wilayah", label: "Tipe Wilayah", sortable: true },
];

const initialFilters = {
  kode_wilayah: "",
  nama_wilayah: "",
  tipe_wilayah: "",
};
</script>
