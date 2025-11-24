<template>
  <BaseTable
    title="Daftar Skala"
    entityName="Skala"
    :apiService="scaleApi"
    :FormModalComponent="ScaleFormModal"
    :columns="columns"
    primaryKey="idskala"
    deleteItemNameKey="namaskala"
    :initialFilters="initialFilters"
    initialSortColumn="namaskala"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-3">
          <label for="filterScaleName" class="form-label text-dark fw-semibold"
            >Skala</label
          >
          <input
            type="text"
            id="filterScaleName"
            class="form-control"
            v-model="filters.namaskala"
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
import { deleteScale, getScales } from "@/services/referensi/scale";

const ScaleFormModal = defineAsyncComponent(() =>
  import("./ScaleFormModal.vue")
);

const scaleApi = {
  get: getScales,
  delete: deleteScale,
};

const columns = [{ key: "namaskala", label: "Nama Skala", sortable: true }];

const initialFilters = {
  namaskala: "",
};
</script>
