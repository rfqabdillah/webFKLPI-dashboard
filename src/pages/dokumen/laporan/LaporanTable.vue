<template>
  <BaseTable
    title="Daftar Laporan"
    entityName="Laporan"
    :apiService="laporanApi"
    :FormModalComponent="LaporanFormModal"
    :columns="columns"
    primaryKey="id_laporan"
    deleteItemNameKey="tahun_laporan"
    :initialFilters="initialFilters"
    initialSortColumn="tahun_laporan"
    initialSortDirection="desc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label
            for="filterTahunLaporan"
            class="form-label text-dark fw-semibold"
            >Tahun Laporan</label
          >
          <input
            type="number"
            id="filterTahunLaporan"
            class="form-control"
            v-model="filters.tahun_laporan"
            placeholder="Contoh: 2026"
          />
        </div>
        <div class="col-md-4">
          <label for="filterKeterangan" class="form-label text-dark fw-semibold"
            >Keterangan</label
          >
          <input
            type="text"
            id="filterKeterangan"
            class="form-control"
            v-model="filters.keterangan_laporan"
            placeholder="Masukkan keterangan"
          />
        </div>
      </div>
    </template>

    <template #cell(nama_organisasi)="{ item }">
      {{ item.fklpi?.nama_organisasi || "-" }}
    </template>

    <template #cell(nama_periode)="{ item }">
      {{ item.periode?.nama_periode || "-" }}
    </template>

    <template #cell(file_laporan)="{ item }">
      <a
        v-if="item.file_laporan"
        :href="item.file_laporan"
        target="_blank"
        class="btn btn-sm btn-outline-primary"
        title="Lihat File Laporan"
      >
        <i class="fa fa-file-pdf-o me-1"></i>Lihat
      </a>
      <span v-else class="text-muted">-</span>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";
import { getLaporan, deleteLaporan } from "@/services/general/dokumen/laporan";

const LaporanFormModal = defineAsyncComponent(() =>
  import("./LaporanFormModal.vue"),
);

const laporanApi = {
  get: getLaporan,
  delete: deleteLaporan,
};

const columns = [
  { key: "nama_organisasi", label: "Organisasi", sortable: true },
  { key: "tahun_laporan", label: "Tahun", sortable: true },
  { key: "nama_periode", label: "Periode", sortable: true },
  { key: "file_laporan", label: "File", sortable: false },
  { key: "keterangan_laporan", label: "Keterangan", sortable: false },
];

const initialFilters = {
  tahun_laporan: "",
  keterangan_laporan: "",
};
</script>
