<template>
  <BaseTable
    title="Daftar Periode"
    entityName="Periode"
    :apiService="periodeApi"
    :FormModalComponent="PeriodeFormModal"
    :columns="columns"
    primaryKey="id_periode"
    deleteItemNameKey="nama_periode"
    :initialFilters="initialFilters"
    initialSortColumn="nama_periode"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterPeriode" class="form-label text-dark fw-semibold"
            >Nama Periode</label
          >
          <input
            type="text"
            id="filterPeriode"
            class="form-control"
            v-model="filters.nama_periode"
            placeholder="Masukkan nama periode"
          />
        </div>
      </div>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";
import { deletePeriode, getPeriode } from "@/services/referensi/periode";

const PeriodeFormModal = defineAsyncComponent(() =>
  import("./PeriodeFormModal.vue"),
);

const periodeApi = {
  get: getPeriode,
  delete: deletePeriode,
};

const columns = [
  {
    key: "nama_periode",
    label: "Periode",
    sortable: true,
  },
];

const initialFilters = {
  nama_periode: "",
};
</script>
