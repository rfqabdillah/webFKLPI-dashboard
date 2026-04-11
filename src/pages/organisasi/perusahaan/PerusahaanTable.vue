<template>
  <BaseTable
    title="Daftar Perusahaan"
    entityName="Perusahaan"
    :apiService="perusahaanApi"
    :FormModalComponent="PerusahaanFormModal"
    :DetailModalComponent="PerusahaanDetailModal"
    :columns="columns"
    primaryKey="id_perusahaan"
    deleteItemNameKey="nama_perusahaan"
    :initialFilters="initialFilters"
    initialSortColumn="nama_perusahaan"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterNama" class="form-label text-dark fw-semibold"
            >Nama Perusahaan</label
          >
          <input
            type="text"
            id="filterNama"
            class="form-control"
            v-model="filters.nama_perusahaan"
            placeholder="Cari nama perusahaan"
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
            placeholder="Cari organisasi"
          />
        </div>
      </div>
    </template>

    <template #cell(logo_perusahaan)="{ item }">
      <img
        v-if="item.logo_perusahaan"
        :src="item.logo_perusahaan"
        alt="Logo"
        class="logo-img"
        @click="showImage(item.logo_perusahaan)"
      />
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(nama_organisasi)="{ item }">
      <span v-if="item.fklpi && item.fklpi.nama_organisasi">
        {{ item.fklpi.nama_organisasi }}
      </span>
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(nama_wilayah)="{ item }">
      <span v-if="item.wilayah && item.wilayah.nama_wilayah">
        {{ item.wilayah.nama_wilayah }}
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
  getPerusahaan,
  deletePerusahaan,
} from "@/services/general/organisasi/perusahaan";

const PerusahaanFormModal = defineAsyncComponent(() =>
  import("./PerusahaanFormModal.vue"),
);
const PerusahaanDetailModal = defineAsyncComponent(() =>
  import("./PerusahaanDetailModal.vue"),
);

const perusahaanApi = {
  get: getPerusahaan,
  delete: deletePerusahaan,
};

const columns = [
  { key: "logo_perusahaan", label: "Logo", sortable: false },
  { key: "nama_perusahaan", label: "Nama Perusahaan", sortable: true },
  { key: "nama_organisasi", label: "Organisasi", sortable: false },
  { key: "nama_wilayah", label: "Wilayah", sortable: false },
];

const initialFilters = {
  nama_perusahaan: "",
  nama_organisasi: "",
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
</script>

<style scoped>
.logo-img {
  width: 45px;
  height: 45px;
  object-fit: contain;
  cursor: pointer;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  background-color: #fff;
  transition: transform 0.2s ease;
}
.logo-img:hover {
  transform: scale(1.15);
}
</style>
