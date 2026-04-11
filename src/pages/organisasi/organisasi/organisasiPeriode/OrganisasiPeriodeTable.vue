<template>
  <BaseTable
    title="Daftar Periode Kepengurusan"
    entityName="Periode Kepengurusan"
    :apiService="periodeApi"
    :FormModalComponent="OrganisasiPeriodeFormModal"
    :DetailModalComponent="OrganisasiPeriodeDetailModal"
    :columns="columns"
    primaryKey="id_organisasi_periode"
    deleteItemNameKey="nomor_sk"
    :initialFilters="initialFilters"
    :fixedFilters="fixedFilters"
    initialSortColumn="tahun_awal"
    initialSortDirection="desc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterOrganisasi" class="form-label text-dark fw-semibold"
            >Organisasi FKLPI</label
          >
          <input
            type="text"
            id="filterOrganisasi"
            class="form-control"
            v-model="filters.nama_organisasi"
            placeholder="Cari nama organisasi"
          />
        </div>
        <div class="col-md-4">
          <label for="filterTahunAwal" class="form-label text-dark fw-semibold"
            >Tahun Awal</label
          >
          <input
            type="number"
            id="filterTahunAwal"
            class="form-control"
            v-model="filters.tahun_awal"
            placeholder="Misal: 2024"
          />
        </div>
        <div class="col-md-4">
          <label for="filterTahunAkhir" class="form-label text-dark fw-semibold"
            >Tahun Akhir</label
          >
          <input
            type="number"
            id="filterTahunAkhir"
            class="form-control"
            v-model="filters.tahun_akhir"
            placeholder="Misal: 2029"
          />
        </div>
      </div>
    </template>

    <template #cell(periode)="{ item }">
      {{ item.tahun_awal || "-" }} s/d {{ item.tahun_akhir || "-" }}
    </template>

    <template #cell(sk_info)="{ item }">
      <div v-if="item.nomor_sk || item.tanggal_sk">
        <div class="fw-semibold">{{ item.nomor_sk || "-" }}</div>
        <div class="small text-muted">
          {{ item.tanggal_sk ? formatDate(item.tanggal_sk) : "-" }}
        </div>
      </div>
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(file_sk)="{ item }">
      <a
        v-if="item.file_sk"
        :href="item.file_sk"
        target="_blank"
        class="btn btn-sm btn-outline-danger"
        title="Lihat Dokumen SK"
      >
        <i class="fa fa-file-pdf-o"></i> Lihat SK
      </a>
      <span v-else class="text-muted">-</span>
    </template>
    <template #custom-actions-middle="{ item }">
      <button
        class="btn btn-primary btn-sm"
        @click="goToPengurus(item)"
        title="Daftar Pengurus"
      >
        <i class="fa fa-users"></i>
      </button>
    </template>
  </BaseTable>

  <!-- Modal Tabel Pengurus -->
  <OrganisasiPengurusListModal
    v-if="isPengurusModalVisible"
    :periode="selectedPeriode"
    @close="closePengurusModal"
  />
</template>

<script setup>
import { defineAsyncComponent, ref } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";

const props = defineProps({
  fixedFilters: {
    type: Object,
    default: () => ({}),
  },
});
import {
  getOrganisasiPeriode,
  deleteOrganisasiPeriode,
} from "@/services/general/organisasi/organisasiPeriode";

const OrganisasiPeriodeFormModal = defineAsyncComponent(() =>
  import("./OrganisasiPeriodeFormModal.vue"),
);
const OrganisasiPeriodeDetailModal = defineAsyncComponent(() =>
  import("./OrganisasiPeriodeDetailModal.vue"),
);
const OrganisasiPengurusListModal = defineAsyncComponent(() =>
  import("../organisasiPengurus/OrganisasiPengurusListModal.vue"),
);

const periodeApi = {
  get: getOrganisasiPeriode,
  delete: deleteOrganisasiPeriode,
};

const columns = [
  { key: "periode", label: "Periode", sortable: true },
  { key: "sk_info", label: "SK Kepengurusan", sortable: false },
  { key: "file_sk", label: "Dokumen", sortable: false },
];

const initialFilters = {
  tahun_awal: "",
  tahun_akhir: "",
};

// Helper for formatting date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const isPengurusModalVisible = ref(false);
const selectedPeriode = ref(null);

function goToPengurus(item) {
  selectedPeriode.value = item;
  isPengurusModalVisible.value = true;
}

function closePengurusModal() {
  isPengurusModalVisible.value = false;
  selectedPeriode.value = null;
}
</script>
