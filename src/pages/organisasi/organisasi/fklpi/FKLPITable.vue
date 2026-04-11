<template>
  <BaseTable
    title="Daftar Organisasi FKLPI"
    entityName="Organisasi"
    :apiService="organisasiApi"
    :FormModalComponent="FKLPIFormModal"
    :DetailModalComponent="FKLPIDetailModal"
    :columns="columns"
    primaryKey="id_organisasi"
    deleteItemNameKey="nama_organisasi"
    :initialFilters="initialFilters"
    initialSortColumn="nama_organisasi"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterNama" class="form-label text-dark fw-semibold"
            >Nama Organisasi</label
          >
          <input
            type="text"
            id="filterNama"
            class="form-control"
            v-model="filters.nama_organisasi"
            placeholder="Masukkan nama organisasi"
          />
        </div>
        <div class="col-md-4">
          <label for="filterLembaga" class="form-label text-dark fw-semibold"
            >Lembaga</label
          >
          <input
            type="text"
            id="filterLembaga"
            class="form-control"
            v-model="filters.nama_lembaga"
            placeholder="Masukkan nama lembaga"
          />
        </div>
        <div class="col-md-4">
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
        v-if="item.lembaga && item.lembaga.logo_lembaga"
        :src="item.lembaga.logo_lembaga"
        alt="Logo"
        class="logo-img"
        @click="showImage(item.lembaga.logo_lembaga)"
      />
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(nama_lembaga)="{ item }">
      <span v-if="item.lembaga && item.lembaga.nama_lembaga">
        {{ item.lembaga.nama_lembaga }}
      </span>
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(nama_wilayah)="{ item }">
      <span v-if="item.wilayah && item.wilayah.nama_wilayah">
        {{ item.wilayah.nama_wilayah }}
      </span>
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(skala)="{ item }">
      <span v-if="item.skala && item.skala.skala">
        {{ item.skala.skala }}
      </span>
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

  <Teleport to="body">
    <vue-easy-lightbox
      :visible="lightboxVisible"
      :imgs="lightboxImgs"
      @hide="hideImage"
    ></vue-easy-lightbox>

    <!-- Modal Tabel Periode -->
    <OrganisasiPeriodeListModal
      v-if="isPeriodeModalVisible"
      :organisasi="selectedOrganisasi"
      @close="closePeriodeModal"
    />
  </Teleport>
</template>

<script setup>
import { defineAsyncComponent, ref } from "vue";
import { useRouter } from "vue-router";
import BaseTable from "@/components/base/BaseTable.vue";
import VueEasyLightbox from "vue-easy-lightbox";
import {
  getOrganisasi,
  deleteOrganisasi,
} from "@/services/general/organisasi/organisasi";

const FKLPIFormModal = defineAsyncComponent(() =>
  import("./FKLPIFormModal.vue"),
);
const FKLPIDetailModal = defineAsyncComponent(() =>
  import("./FKLPIDetailModal.vue"),
);
const OrganisasiPeriodeListModal = defineAsyncComponent(() =>
  import("../organisasiPeriode/OrganisasiPeriodeListModal.vue"),
);

const router = useRouter();

const organisasiApi = {
  get: getOrganisasi,
  delete: deleteOrganisasi,
};

const columns = [
  { key: "logo_lembaga", label: "Logo", sortable: false },
  { key: "nama_organisasi", label: "Nama Organisasi", sortable: true },
  { key: "nama_lembaga", label: "Lembaga", sortable: true },
  { key: "nama_wilayah", label: "Wilayah", sortable: true },
  { key: "skala", label: "Skala", sortable: true },
];

const initialFilters = {
  nama_organisasi: "",
  nama_lembaga: "",
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

const isPeriodeModalVisible = ref(false);
const selectedOrganisasi = ref(null);

function goToPengurus(item) {
  selectedOrganisasi.value = item;
  isPeriodeModalVisible.value = true;
}

function closePeriodeModal() {
  isPeriodeModalVisible.value = false;
  selectedOrganisasi.value = null;
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
