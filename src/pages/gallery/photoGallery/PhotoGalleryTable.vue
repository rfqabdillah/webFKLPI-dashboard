<template>
  <BaseTable
    title="Daftar Galeri Foto"
    entityName="Galeri Foto"
    :apiService="photoGalleryApi"
    :FormModalComponent="PhotoGalleryFormModal"
    :columns="columns"
    primaryKey="idgalerifoto"
    deleteItemNameKey="gallery.judul"
    :initialFilters="initialFilters"
    initialSortColumn="created_at"
    initialSortDirection="desc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterGalleryTitle" class="form-label text-dark fw-semibold">Judul Galeri</label>
          <input
            type="text"
            id="filterGalleryTitle"
            class="form-control"
            v-model="filters.judul"
            placeholder="Cari berdasarkan nama galeri"
          />
        </div>

        <div class="col-md-4">
          <label for="filterStatusTayang" class="form-label text-dark fw-semibold">Status Galeri</label>
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

    <template #cell(foto)="{ item }">
      <img
        v-if="item.foto"
        :src="item.foto"
        alt="Foto"
        style="width: 150px; height: auto; cursor: pointer; border-radius: 4px;"
        @click="showImage(item.foto)"
      />
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(judul)="{ item }">
      <span v-if="item['gallery']">
        {{ item['gallery'].judul }}
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
import { defineAsyncComponent, ref } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import { deletePhotoGallery, getPhotoGallery } from '@/services/general/website/gallery/photoGallery';
import VueEasyLightbox from 'vue-easy-lightbox';

const PhotoGalleryFormModal = defineAsyncComponent(() =>
  import('./PhotoGalleryFormModal.vue')
);

const photoGalleryApi = {
  get: getPhotoGallery,
  delete: deletePhotoGallery,
};

const columns = [
  { key: 'foto', label: 'Foto', sortable: false },
  { key: 'judul', label: 'Nama Galeri', sortable: false },
];

const initialFilters = {
  judul: "",
  tayang: "",
};

const lightboxVisible = ref(false);
const lightboxImgs = ref('');

function showImage(imageUrl) {
  if (imageUrl) {
    lightboxImgs.value = imageUrl;
    lightboxVisible.value = true;
  }
}

function hideImage() {
  lightboxVisible.value = false;
}
</script>