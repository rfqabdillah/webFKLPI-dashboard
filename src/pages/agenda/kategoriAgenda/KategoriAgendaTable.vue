<template>
  <BaseTable
    title="Daftar Kategori Agenda"
    entityName="Kategori Agenda"
    :apiService="categoryApi"
    :FormModalComponent="AgendaCategoryFormModal"
    :columns="columns"
    primaryKey="id_kategori_agenda"
    deleteItemNameKey="nama_kategori_agenda"
    :initialFilters="initialFilters"
    initialSortColumn="nama_kategori_agenda"
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
            v-model="filters.nama_kategori_agenda"
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
  deleteKategoriAgenda,
  getKategoriAgenda,
} from "@/services/referensi/kategoriAgenda";

const AgendaCategoryFormModal = defineAsyncComponent(() =>
  import("./KategoriAgendaFormModal.vue"),
);

const categoryApi = {
  get: getKategoriAgenda,
  delete: deleteKategoriAgenda,
};

const columns = [
  { key: "nama_kategori_agenda", label: "Nama Kategori (ID)", sortable: true },
  {
    key: "nama_kategori_agenda_en",
    label: "Nama Kategori (EN)",
    sortable: true,
  },
  { key: "slug", label: "Slug", sortable: true },
];

const initialFilters = {
  nama_kategori_agenda: "",
};
</script>
