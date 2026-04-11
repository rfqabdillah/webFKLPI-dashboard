<template>
  <BaseTable
    title="Daftar MOU"
    entityName="MOU"
    :apiService="mouApi"
    :FormModalComponent="MouFormModal"
    :columns="columns"
    primaryKey="id_mou"
    deleteItemNameKey="tanggal_mou"
    :initialFilters="initialFilters"
    initialSortColumn="tanggal_mou"
    initialSortDirection="desc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterTanggalMou" class="form-label text-dark fw-semibold"
            >Tanggal MOU</label
          >
          <input
            type="date"
            id="filterTanggalMou"
            class="form-control"
            v-model="filters.tanggal_mou"
          />
        </div>
      </div>
    </template>

    <template #cell(tanggal_mou)="{ value }">
      {{ formatTanggal(value) }}
    </template>

    <template #cell(nama_organisasi)="{ item }">
      {{ item.fklpi?.nama_organisasi || "-" }}
    </template>

    <template #cell(nama_perusahaan)="{ item }">
      {{ item.perusahaan?.nama_perusahaan || "-" }}
    </template>

    <template #cell(nama_lembaga)="{ item }">
      {{ item.lembaga?.nama_lembaga || "-" }}
    </template>

    <template #cell(file_mou)="{ item }">
      <a
        v-if="item.file_mou"
        :href="item.file_mou"
        target="_blank"
        class="btn btn-sm btn-outline-primary"
        title="Lihat File MOU"
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
import { getMou, deleteMou } from "@/services/general/pelatihan/mou";

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

const MouFormModal = defineAsyncComponent(() => import("./MouFormModal.vue"));

const mouApi = {
  get: getMou,
  delete: deleteMou,
};

const columns = [
  { key: "tanggal_mou", label: "Tanggal MOU", sortable: true },
  { key: "nama_organisasi", label: "Organisasi", sortable: false },
  { key: "nama_perusahaan", label: "Perusahaan", sortable: false },
  { key: "nama_lembaga", label: "Lembaga", sortable: false },
  { key: "file_mou", label: "File MOU", sortable: false },
];

const initialFilters = {
  tanggal_mou: "",
};
</script>
