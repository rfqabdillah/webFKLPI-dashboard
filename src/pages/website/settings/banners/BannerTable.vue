<template>
  <BaseTable
    title="Daftar Banner"
    entityName="Banner"
    :apiService="bannerApi"
    :FormModalComponent="BannerFormModal"
    :columns="columns"
    primaryKey="id_banner"
    deleteItemNameKey="judul"
    :initialFilters="initialFilters"
    initialSortColumn="created_at"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label
            for="filterBannerTitle"
            class="form-label text-dark fw-semibold"
            >Judul</label
          >
          <input
            type="text"
            id="filterBannerTitle"
            class="form-control"
            v-model="filters.judul"
            placeholder="Masukkan judul banner"
          />
        </div>

        <div class="col-md-4">
          <label
            for="filterStatusTayang"
            class="form-label text-dark fw-semibold"
            >Status Tayang</label
          >
          <select
            id="filterStatusTayang"
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

    <template #cell(gambar)="{ item }">
      <img
        v-if="item.gambar"
        :src="item.gambar"
        alt="Banner"
        style="width: 150px; height: auto; cursor: pointer; border-radius: 4px"
        @click="showImage(item.gambar)"
      />
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(tayang)="{ value }">
      <span
        :class="value === 'Tayang' ? 'badge bg-success' : 'badge bg-warning'"
      >
        {{ value }}
      </span>
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
import { deleteBanner, getBanner } from "@/services/referensi/banner";

const BannerFormModal = defineAsyncComponent(() =>
  import("./BannerFormModal.vue"),
);

const bannerApi = {
  get: getBanner,
  delete: deleteBanner,
};

const columns = [
  { key: "judul", label: "Judul", sortable: true },
  { key: "gambar", label: "Gambar", sortable: false },
  { key: "tayang", label: "Status", sortable: true },
];

const initialFilters = {
  judul: "",
  tayang: "",
};

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
