<template>
  <BaseTable
    title="Daftar Skala"
    entityName="Skala"
    :apiService="skalaApi"
    :FormModalComponent="SkalaFormModal"
    :columns="columns"
    primaryKey="id_skala"
    deleteItemNameKey="skala"
    :initialFilters="initialFilters"
    initialSortColumn="skala"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-3">
          <label for="filterSkala" class="form-label text-dark fw-semibold"
            >Skala</label
          >
          <input
            type="text"
            id="filterSkala"
            class="form-control"
            v-model="filters.skala"
            placeholder="Masukkan nama skala"
          />
        </div>
      </div>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";
import { deleteSkala, getSkala } from "@/services/referensi/skala";

const SkalaFormModal = defineAsyncComponent(() =>
  import("./SkalaFormModal.vue"),
);

const skalaApi = {
  get: getSkala,
  delete: deleteSkala,
};

const columns = [{ key: "skala", label: "Nama Skala", sortable: true }];

const initialFilters = {
  skala: "",
};
</script>
