<template>
  <BaseTable
    title="Daftar Profesi"
    entityName="Profesi"
    :apiService="profesiApi"
    :FormModalComponent="ProfesiFormModal"
    :columns="columns"
    primaryKey="kode_kbji"
    deleteItemNameKey="nama_kbji"
    :initialFilters="initialFilters"
    initialSortColumn="nama_kbji"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label
            for="filterProfesiCode"
            class="form-label text-dark fw-semibold"
            >Kode Profesi</label
          >
          <input
            type="text"
            id="filterProfesiCode"
            class="form-control"
            v-model="filters.kode_kbji"
            placeholder="Masukkan kode profesi"
          />
        </div>
        <div class="col-md-4">
          <label
            for="filterProfesiName"
            class="form-label text-dark fw-semibold"
            >Nama Profesi</label
          >
          <input
            type="text"
            id="filterProfesiName"
            class="form-control"
            v-model="filters.nama_kbji"
            placeholder="Masukkan nama profesi"
          />
        </div>
      </div>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";
import { deleteKbji, getKbji } from "@/services/referensi/kbji";

const ProfesiFormModal = defineAsyncComponent(() =>
  import("./ProfesiFormModal.vue"),
);

const profesiApi = {
  get: getKbji,
  delete: deleteKbji,
};

const columns = [
  { key: "kode_kbji", label: "Kode Profesi", sortable: true },
  { key: "nama_kbji", label: "Nama Profesi", sortable: true },
];

const initialFilters = {
  nama_kbji: "",
  kode_kbji: "",
};
</script>
