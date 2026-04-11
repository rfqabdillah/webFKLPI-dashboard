<template>
  <BaseTable
    title="Daftar Halaman"
    entityName="Halaman"
    :apiService="halamanApi"
    :FormModalComponent="HalamanFormModal"
    :DetailModalComponent="HalamanDetailModal"
    :columns="columns"
    primaryKey="id_halaman"
    deleteItemNameKey="judul"
    :initialFilters="initialFilters"
    initialSortColumn="judul"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterJudul" class="form-label text-dark fw-semibold"
            >Judul</label
          >
          <input
            type="text"
            id="filterJudul"
            class="form-control"
            v-model="filters.judul"
            placeholder="Masukkan judul halaman"
          />
        </div>
        <div class="col-md-4">
          <label for="filterKataKunci" class="form-label text-dark fw-semibold"
            >Kata Kunci</label
          >
          <input
            type="text"
            id="filterKataKunci"
            class="form-control"
            v-model="filters.katakunci"
            placeholder="Masukkan kata kunci"
          />
        </div>
        <div class="col-md-4">
          <label for="filterStatus" class="form-label text-dark fw-semibold"
            >Status Tayang</label
          >
          <select
            id="filterStatus"
            class="form-select"
            v-model="filters.tayang"
          >
            <option value="">Semua Status</option>
            <option value="Tayang">Tayang</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>
    </template>

    <template #cell(created_at)="{ value }">
      {{ formatDate(value) }}
    </template>

    <template #cell(tayang)="{ value }">
      <span
        class="badge"
        :class="{
          'bg-success': value === 'Tayang',
          'bg-warning': value === 'Draft',
          'bg-light text-dark': value !== 'Tayang' && value !== 'Draft',
        }"
      >
        {{ value || "N/A" }}
      </span>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";
import { formatDate } from "@/utils/formatDate";
import { deleteHalaman, getHalaman } from "@/services/general/website/halaman";

const HalamanFormModal = defineAsyncComponent(() =>
  import("./HalamanFormModal.vue"),
);
const HalamanDetailModal = defineAsyncComponent(() =>
  import("./HalamanDetailModal.vue"),
);

const halamanApi = {
  get: getHalaman,
  delete: deleteHalaman,
};

const columns = [
  { key: "judul", label: "Judul", sortable: true },
  { key: "katakunci", label: "Kata Kunci", sortable: true },
  { key: "tayang", label: "Status", sortable: true },
];

const initialFilters = {
  judul: "",
  katakunci: "",
  tayang: "",
};
</script>
