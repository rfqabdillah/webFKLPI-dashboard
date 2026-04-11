<template>
  <BaseDetailModal
    title="Detail Perusahaan"
    :item-to-view="itemToView"
    :api-detail-fn="getDetailPerusahaan"
    id-key="id_perusahaan"
    @close="$emit('close')"
  >
    <template #detail="{ item }">
      <!-- Header: Banner + Logo + Nama -->
      <div class="text-center mb-4">
        <div v-if="item.banner_perusahaan" class="banner-wrapper mb-3">
          <img
            :src="item.banner_perusahaan"
            alt="Banner Perusahaan"
            class="banner-img"
            @click="showImage(item.banner_perusahaan)"
            onerror="this.style.display='none'"
          />
        </div>

        <div class="logo-wrapper">
          <img
            v-if="item.logo_perusahaan"
            :src="item.logo_perusahaan"
            alt="Logo Perusahaan"
            class="logo-detail-img"
            @click="showImage(item.logo_perusahaan)"
            onerror="this.src='https://placehold.co/100x100/EBF4FF/7F9CF5?text=Logo'"
          />
          <img
            v-else
            src="https://placehold.co/100x100/EBF4FF/7F9CF5?text=Logo"
            alt="Logo Default"
            class="logo-detail-img"
          />
        </div>

        <h2 class="nama-perusahaan mt-3">
          {{ item.nama_perusahaan || "Nama Perusahaan" }}
        </h2>
        <p v-if="item.fklpi" class="text-muted mb-0">
          {{ item.fklpi.nama_organisasi }}
        </p>
      </div>

      <hr />

      <div class="detail-section">
        <h4><i class="fa fa-info-circle me-2"></i>Informasi Umum</h4>
        <div class="row detail-grid-container">
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>NPWP</dt>
              <dd>{{ item.npwp_perusahaan || "-" }}</dd>

              <dt>NIB</dt>
              <dd>{{ item.nib_perusahaan || "-" }}</dd>

              <dt>Email</dt>
              <dd>{{ item.email_perusahaan || "-" }}</dd>
            </dl>
          </div>

          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Telepon</dt>
              <dd>{{ item.telepon_perusahaan || "-" }}</dd>

              <dt>Wilayah</dt>
              <dd>{{ item.wilayah?.nama_wilayah || "-" }}</dd>

              <dt>Alamat</dt>
              <dd>{{ item.alamat_perusahaan || "-" }}</dd>

              <dt>Koordinat</dt>
              <dd>{{ item.koordinat || "-" }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <hr />

      <div class="detail-section">
        <h4><i class="fa fa-file-text-o me-2"></i>Deskripsi</h4>
        <div class="text-content">
          {{ item.deskripsi_perusahaan || "Deskripsi tidak tersedia." }}
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
import { getDetailPerusahaan } from "@/services/general/organisasi/perusahaan";

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
.banner-wrapper {
  border-radius: 12px;
  overflow: hidden;
  background-color: #f8f9fa;
  border: 1px solid #eaebec;
}
.banner-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
  transition: opacity 0.2s ease;
}
.banner-img:hover {
  opacity: 0.9;
}
.logo-wrapper {
  margin-top: -50px;
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
.nama-perusahaan {
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
  min-height: 100px;
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
