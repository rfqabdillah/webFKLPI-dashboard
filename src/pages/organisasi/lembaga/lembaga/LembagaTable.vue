<template>
  <BaseTable
    title="Daftar Lembaga"
    entityName="Lembaga"
    :apiService="lembagaApi"
    :FormModalComponent="LembagaFormModal"
    :DetailModalComponent="LembagaDetailModal"
    :columns="columns"
    primaryKey="id_lembaga"
    deleteItemNameKey="nama_lembaga"
    :initialFilters="initialFilters"
    initialSortColumn="nama_lembaga"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-3">
          <label for="filterNama" class="form-label text-dark fw-semibold"
            >Nama Lembaga</label
          >
          <input
            type="text"
            id="filterNama"
            class="form-control"
            v-model="filters.nama_lembaga"
            placeholder="Masukkan nama lembaga"
          />
        </div>
        <div class="col-md-3">
          <label for="filterJenis" class="form-label text-dark fw-semibold"
            >Jenis Lembaga</label
          >
          <input
            type="text"
            id="filterJenis"
            class="form-control"
            v-model="filters.nama_jenis_lembaga"
            placeholder="Masukkan jenis lembaga"
          />
        </div>
        <div class="col-md-3">
          <label for="filterWilayah" class="form-label text-dark fw-semibold"
            >Wilayah</label
          >
          <input
            type="text"
            id="filterWilayah"
            class="form-control"
            v-model="filters.nama_wilayah"
            placeholder="Masukkan nama wilayah"
          />
        </div>
      </div>
    </template>

    <template #cell(logo_lembaga)="{ item }">
      <img
        v-if="item.logo_lembaga"
        :src="item.logo_lembaga"
        alt="Logo"
        class="logo-img"
        @click="showImage(item.logo_lembaga)"
      />
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(nama_jenis_lembaga)="{ item }">
      <span v-if="item['jenis-lembaga']">
        {{ item["jenis-lembaga"].nama_jenis_lembaga || "-" }}
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
  getLembaga,
  deleteLembaga,
} from "@/services/general/organisasi/lembaga";

const LembagaFormModal = defineAsyncComponent(() =>
  import("./LembagaFormModal.vue"),
);
const LembagaDetailModal = defineAsyncComponent(() =>
  import("./LembagaDetailModal.vue"),
);

const lembagaApi = {
  get: getLembaga,
  delete: deleteLembaga,
};

const columns = [
  { key: "logo_lembaga", label: "Logo", sortable: false },
  { key: "nama_lembaga", label: "Nama Lembaga", sortable: true },
  { key: "vin", label: "VIN", sortable: true },
  { key: "nama_jenis_lembaga", label: "Jenis Lembaga", sortable: true },
  { key: "nama_wilayah", label: "Wilayah", sortable: true },
  { key: "alamat_lembaga", label: "Alamat", sortable: false },
];

const initialFilters = {
  nama_lembaga: "",
  nama_jenis_lembaga: "",
  nama_wilayah: "",
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
  width: 50px;
  height: 50px;
  object-fit: contain;
  cursor: pointer;
  border-radius: 4px;
  transition: transform 0.2s ease;
}
.logo-img:hover {
  transform: scale(1.1);
}
</style>
