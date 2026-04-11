<template>
  <BaseTable
    title="Daftar Pengurus Organisasi"
    entityName="Pengurus"
    :apiService="pengurusApi"
    :FormModalComponent="OrganisasiPengurusFormModal"
    :columns="columns"
    primaryKey="id_pengurus"
    deleteItemNameKey="nama_pengurus"
    :initialFilters="initialFilters"
    :fixedFilters="fixedFilters"
    initialSortColumn="nama_pengurus"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterNama" class="form-label text-dark fw-semibold"
            >Nama Pengurus</label
          >
          <input
            type="text"
            id="filterNama"
            class="form-control"
            v-model="filters.nama_pengurus"
            placeholder="Cari nama pengurus"
          />
        </div>
        <div class="col-md-4">
          <label for="filterJabatan" class="form-label text-dark fw-semibold"
            >Jabatan</label
          >
          <input
            type="text"
            id="filterJabatan"
            class="form-control"
            v-model="filters.nama_jabatan"
            placeholder="Cari jabatan"
          />
        </div>
      </div>
    </template>

    <template #cell(foto_pengurus)="{ item }">
      <img
        v-if="item.foto_pengurus"
        :src="item.foto_pengurus"
        alt="Foto"
        class="foto-img"
        @click="showImage(item.foto_pengurus)"
      />
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(nama_jabatan)="{ item }">
      <span v-if="item.jabatan && item.jabatan.nama_jabatan">
        {{ item.jabatan.nama_jabatan }}
      </span>
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(nama_periode)="{ item }">
      <span
        v-if="
          item['organisasi-periode'] &&
          item['organisasi-periode'].tahun_awal &&
          item['organisasi-periode'].tahun_akhir
        "
      >
        {{ item["organisasi-periode"].tahun_awal }} -
        {{ item["organisasi-periode"].tahun_akhir }}
      </span>
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(nama_status_pengurus)="{ item }">
      <span
        v-if="
          item['status-pengurus'] &&
          item['status-pengurus'].nama_status_pengurus
        "
        class="badge"
        :style="getStatusStyle(item['status-pengurus'].nama_status_pengurus)"
      >
        {{ item["status-pengurus"].nama_status_pengurus }}
      </span>
      <span v-else class="text-muted">-</span>
    </template>
  </BaseTable>

  <Teleport to="body">
    <vue-easy-lightbox
      :visible="lightboxVisible"
      :imgs="lightboxImgs"
      @hide="hideImage"
    ></vue-easy-lightbox>
  </Teleport>
</template>

<script setup>
import { defineAsyncComponent, ref } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";
import VueEasyLightbox from "vue-easy-lightbox";
import {
  getOrganisasiPengurus,
  deleteOrganisasiPengurus,
} from "@/services/general/organisasi/organisasiPengurus";

const props = defineProps({
  fixedFilters: {
    type: Object,
    default: () => ({}),
  },
});

const OrganisasiPengurusFormModal = defineAsyncComponent(() =>
  import("./OrganisasiPengurusFormModal.vue"),
);

const pengurusApi = {
  get: getOrganisasiPengurus,
  delete: deleteOrganisasiPengurus,
};

const columns = [
  { key: "foto_pengurus", label: "Foto", sortable: false },
  { key: "nama_pengurus", label: "Nama Pengurus", sortable: true },
  { key: "nama_jabatan", label: "Jabatan", sortable: false },
  { key: "nama_periode", label: "Periode", sortable: false },
  { key: "nama_status_pengurus", label: "Status", sortable: false },
];

const initialFilters = {
  nama_pengurus: "",
  nama_jabatan: "",
};

// Lightbox
const lightboxVisible = ref(false);
const lightboxImgs = ref("");

function showImage(imageUrl) {
  lightboxImgs.value = imageUrl;
  lightboxVisible.value = true;
}

function hideImage() {
  lightboxVisible.value = false;
}

function getStatusStyle(statusName) {
  if (!statusName) return { backgroundColor: "#6c757d", color: "#fff" };
  const lower = statusName.toLowerCase();
  if (lower === "aktif") return { backgroundColor: "#28a745", color: "#fff" };
  if (lower === "tidak aktif")
    return { backgroundColor: "#6c757d", color: "#fff" };
  if (lower === "mengundurkan diri")
    return { backgroundColor: "#e67e22", color: "#fff" };
  if (lower === "diberhentikan")
    return { backgroundColor: "#e74c3c", color: "#fff" };
  return { backgroundColor: "#6c757d", color: "#fff" };
}
</script>

<style scoped>
.foto-img {
  width: 45px;
  height: 45px;
  object-fit: cover;
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid #dee2e6;
  transition: transform 0.2s ease;
}
.foto-img:hover {
  transform: scale(1.15);
}
</style>
