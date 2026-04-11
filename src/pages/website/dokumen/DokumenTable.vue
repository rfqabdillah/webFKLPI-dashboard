<template>
  <BaseTable
    title="Daftar Dokumen"
    entityName="Dokumen"
    :apiService="dokumenApi"
    :FormModalComponent="DokumenFormModal"
    :DetailModalComponent="DokumenDetailModal"
    :columns="columns"
    primaryKey="id_dokumen"
    deleteItemNameKey="nama_dokumen"
    :initialFilters="initialFilters"
    initialSortColumn="nama_dokumen"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-3">
          <label for="filterNama" class="form-label text-dark fw-semibold"
            >Nama Dokumen</label
          >
          <input
            type="text"
            id="filterNama"
            class="form-control"
            v-model="filters.nama_dokumen"
            placeholder="Masukkan nama dokumen"
          />
        </div>
        <div class="col-md-3">
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
        <div class="col-md-3">
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

    <template #cell(nama_organisasi)="{ item }">
      <span v-if="item.fklpi && item.fklpi.nama_organisasi">
        {{ item.fklpi.nama_organisasi }}
      </span>
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(file_dokumen)="{ value }">
      <a
        v-if="value"
        :href="value"
        target="_blank"
        class="btn btn-sm btn-outline-primary"
        title="Lihat Dokumen"
      >
        <i class="fa fa-file-pdf-o"></i>
      </a>
      <span v-else class="text-muted">-</span>
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
import { deleteDokumen, getDokumen } from "@/services/general/website/dokumen";

const DokumenFormModal = defineAsyncComponent(() =>
  import("./DokumenFormModal.vue"),
);
const DokumenDetailModal = defineAsyncComponent(() =>
  import("./DokumenDetailModal.vue"),
);

const dokumenApi = {
  get: getDokumen,
  delete: deleteDokumen,
};

const columns = [
  { key: "nama_dokumen", label: "Nama Dokumen", sortable: true },
  { key: "nama_organisasi", label: "Organisasi", sortable: true },
  { key: "file_dokumen", label: "Dokumen", sortable: false },
  { key: "created_at", label: "Tanggal Upload", sortable: true },
  { key: "tayang", label: "Status", sortable: true },
];

const initialFilters = {
  nama_dokumen: "",
  nama_organisasi: "",
  tayang: "",
};
</script>
