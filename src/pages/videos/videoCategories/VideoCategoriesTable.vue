<template>
  <BaseTable
    title="Daftar Kategori Video"
    entityName="Kategori Video"
    :apiService="categoryApi"
    :FormModalComponent="VideoCategoryFormModal"
    :columns="columns"
    primaryKey="idkategorivideo"
    deleteItemNameKey="namakategorivideo"
    :initialFilters="initialFilters"
    initialSortColumn="namakategorivideo"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label
            for="filterNamaKategori"
            class="form-label text-dark fw-semibold"
            >Nama Kategori</label
          >
          <input
            type="text"
            id="filterNamaKategori"
            class="form-control"
            v-model="filters.namakategorivideo"
            placeholder="Masukkan nama kategori"
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
  deleteVideoCategory,
  getVideoCategories,
} from "@/services/general/website/videos/videoCategories";

const VideoCategoryFormModal = defineAsyncComponent(() =>
  import("./VideoCategoryFormModal.vue")
);

const categoryApi = {
  get: getVideoCategories,
  delete: deleteVideoCategory,
};

const columns = [
  { key: "namakategorivideo", label: "Nama Kategori (ID)", sortable: true },
  { key: "namakategorivideo_en", label: "Nama Kategori (EN)", sortable: true },
];

const initialFilters = {
  namakategorivideo: "",
};
</script>
