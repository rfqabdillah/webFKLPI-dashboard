<template>
  <BaseDetailModal
    title="Detail Lembaga"
    :item-to-view="itemToView"
    :api-detail-fn="getDetailLembaga"
    id-key="id_lembaga"
    @close="$emit('close')"
  >
    <template #detail="{ item }">
      <!-- Header: Logo + Cover -->
      <div class="text-center mb-4">
        <div v-if="item.cover_lembaga" class="cover-wrapper mb-3">
          <img
            :src="item.cover_lembaga"
            alt="Cover Lembaga"
            class="cover-img"
            @click="showImage(item.cover_lembaga)"
            onerror="this.src='https://placehold.co/600x200/EBF4FF/7F9CF5?text=Cover'"
          />
        </div>

        <div class="logo-wrapper">
          <img
            v-if="item.logo_lembaga"
            :src="item.logo_lembaga"
            alt="Logo Lembaga"
            class="logo-detail-img"
            @click="showImage(item.logo_lembaga)"
            onerror="this.src='https://placehold.co/100x100/EBF4FF/7F9CF5?text=Logo'"
          />
          <img
            v-else
            src="https://placehold.co/100x100/EBF4FF/7F9CF5?text=Logo"
            alt="Logo Default"
            class="logo-detail-img"
          />
        </div>

        <h2 class="nama-lembaga mt-3">
          {{ item.nama_lembaga || "Nama Lembaga" }}
        </h2>
        <p class="text-muted mb-0" v-if="item.vin">VIN: {{ item.vin }}</p>
      </div>

      <hr />

      <!-- Info Detail -->
      <div class="detail-section">
        <h4><i class="fa fa-info-circle me-2"></i>Informasi Lembaga</h4>
        <div class="row detail-grid-container">
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Jenis Lembaga</dt>
              <dd>
                <span v-if="item['jenis-lembaga']">
                  {{ item["jenis-lembaga"].nama_jenis_lembaga || "-" }}
                </span>
                <span v-else class="text-muted">-</span>
              </dd>

              <dt>Wilayah</dt>
              <dd>
                <span v-if="item.wilayah && item.wilayah.nama_wilayah">
                  {{ item.wilayah.nama_wilayah }}
                </span>
                <span v-else class="text-muted">-</span>
              </dd>
            </dl>
          </div>

          <div class="col-md-6">
            <dl class="detail-list">
              <dt>VIN</dt>
              <dd>{{ item.vin || "-" }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <hr />

      <!-- Alamat -->
      <div class="detail-section">
        <h4><i class="fa fa-map-marker me-2"></i>Alamat</h4>
        <div class="text-content">
          {{ item.alamat_lembaga || "Alamat tidak tersedia." }}
        </div>
      </div>
    </template>
  </BaseDetailModal>

  <Teleport to="body">
    <vue-easy-lightbox
      :visible="lightboxVisible"
      :imgs="lightboxImgs"
      @hide="hideImage"
    ></vue-easy-lightbox>
  </Teleport>
</template>

<script setup>
import { ref } from "vue";
import BaseDetailModal from "@/components/base/BaseDetailModal.vue";
import VueEasyLightbox from "vue-easy-lightbox";
import { getDetailLembaga } from "@/services/general/organisasi/lembaga";

defineProps({
  itemToView: {
    type: Object,
    required: true,
  },
});

defineEmits(["close"]);

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
.cover-wrapper {
  border-radius: 8px;
  overflow: hidden;
}
.cover-img {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}
.cover-img:hover {
  opacity: 0.85;
}
.logo-wrapper {
  margin-top: -40px;
  position: relative;
  z-index: 1;
}
.logo-detail-img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border-radius: 12px;
  border: 3px solid #fff;
  background-color: #f8f9fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
}
.logo-detail-img:hover {
  transform: scale(1.05);
}
.nama-lembaga {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}
.detail-section {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.detail-section h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #000;
  border-bottom: 2px solid #6c757d;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}
.text-content {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  color: #212529;
  line-height: 1.6;
  min-height: 80px;
  white-space: pre-wrap;
}
.detail-grid-container {
  padding-top: 0.5rem;
}
.detail-list {
  margin-bottom: 0;
}
.detail-list dt {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}
.detail-list dd {
  color: #555;
  margin-bottom: 1.15rem;
  padding-left: 0;
}
</style>
