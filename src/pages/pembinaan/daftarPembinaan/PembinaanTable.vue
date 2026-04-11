<template>
  <BaseTable
    title="Daftar Pembinaan"
    entityName="Pembinaan"
    :apiService="pembinaanApi"
    :FormModalComponent="PembinaanFormModal"
    :DetailModalComponent="PembinaanDetailModal"
    :columns="columns"
    primaryKey="id_pembinaan"
    deleteItemNameKey="nama_pembinaan"
    :initialFilters="initialFilters"
    initialSortColumn="tanggal_mulai"
    initialSortDirection="desc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label
            for="filterNamaPembinaan"
            class="form-label text-dark fw-semibold"
            >Nama Pembinaan</label
          >
          <input
            type="text"
            id="filterNamaPembinaan"
            class="form-control"
            v-model="filters.nama_pembinaan"
            placeholder="Masukkan nama pembinaan"
          />
        </div>
        <div class="col-md-4">
          <label for="filterOrganisasi" class="form-label text-dark fw-semibold"
            >Organisasi</label
          >
          <input
            type="text"
            id="filterOrganisasi"
            class="form-control"
            v-model="filters.nama_organisasi"
            placeholder="Masukkan nama organisasi"
          />
        </div>
      </div>
    </template>

    <template #cell(nama_organisasi)="{ item }">
      {{ item.fklpi?.nama_organisasi || "-" }}
    </template>

    <template #cell(nama_jenis_pembinaan)="{ item }">
      {{ item["jenis-pembinaan"]?.nama_jenis_pembinaan || "-" }}
    </template>

    <template #cell(nama_metode_pembinaan)="{ item }">
      {{ item["metode-pembinaan"]?.nama_metode_pembinaan || "-" }}
    </template>

    <template #cell(tanggal_mulai)="{ value }">
      {{ formatTanggal(value) }}
    </template>

    <template #cell(tanggal_selesai)="{ value }">
      {{ formatTanggal(value) }}
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";
import {
  getPembinaan,
  deletePembinaan,
} from "@/services/general/pembinaan/pembinaan";

const PembinaanFormModal = defineAsyncComponent(() =>
  import("./PembinaanFormModal.vue"),
);

const PembinaanDetailModal = defineAsyncComponent(() =>
  import("./PembinaanDetailModal.vue"),
);

const pembinaanApi = {
  get: getPembinaan,
  delete: deletePembinaan,
};

function formatTanggal(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const columns = [
  { key: "nama_pembinaan", label: "Nama Pembinaan", sortable: true },
  { key: "nama_jenis_pembinaan", label: "Jenis", sortable: false },
  { key: "nama_metode_pembinaan", label: "Metode", sortable: false },
  { key: "nama_organisasi", label: "Organisasi", sortable: false },
  { key: "tanggal_mulai", label: "Tgl Mulai", sortable: true },
  { key: "tanggal_selesai", label: "Tgl Selesai", sortable: true },
];

const initialFilters = {
  nama_pembinaan: "",
  nama_organisasi: "",
};
</script>
