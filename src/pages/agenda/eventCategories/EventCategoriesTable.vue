<template>
  <BaseTable
    title="Daftar Kategori Program"
    entityName="Kategori Program"
    :apiService="categoryApi"
    :FormModalComponent="AgendaCategoryFormModal"
    :columns="columns"
    primaryKey="idakategoriagenda"
    deleteItemNameKey="namakategoriagenda"
    :initialFilters="initialFilters"
    initialSortColumn="namakategoriagenda"
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
            v-model="filters.namakategoriagenda"
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
  getEventCategories,
  deleteEventCategory,
} from "@/services/general/events/eventsCategories";

const AgendaCategoryFormModal = defineAsyncComponent(() =>
  import("./EventCategoryFormModal.vue")
);

const categoryApi = {
  get: getEventCategories,
  delete: deleteEventCategory,
};

const columns = [
  { key: "namakategoriagenda", label: "Nama Kategori (ID)", sortable: true },
  { key: "namakategoriagenda_en", label: "Nama Kategori (EN)", sortable: true },
  { key: "slug", label: "Slug", sortable: true },
];

const initialFilters = {
  namakategoriagenda: "",
};
</script>
