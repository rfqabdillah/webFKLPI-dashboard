<template>
  <BaseTable
    title="Daftar Kategori Berita"
    entityName="Kategori Berita"
    :apiService="categoryApi"
    :FormModalComponent="NewsCategoryFormModal"
    :columns="columns"
    primaryKey="id_kategori_berita"
    deleteItemNameKey="nama_kategori_berita"
    :initialFilters="initialFilters"
    initialSortColumn="nama_kategori_berita"
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
            v-model="filters.nama_kategori_berita"
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
  deleteKategoriBerita,
  getKategoriBerita,
} from "@/services/referensi/kategoriBerita";

const NewsCategoryFormModal = defineAsyncComponent(() =>
  import("./KategoriBeritaFormModal.vue"),
);

const categoryApi = {
  get: getKategoriBerita,
  delete: deleteKategoriBerita,
};

const columns = [
  { key: "nama_kategori_berita", label: "Nama Kategori (ID)", sortable: true },
  {
    key: "nama_kategori_berita_en",
    label: "Nama Kategori (EN)",
    sortable: true,
  },
  { key: "slug", label: "Slug", sortable: true },
];

const initialFilters = {
  nama_kategori_berita: "",
};
</script>
