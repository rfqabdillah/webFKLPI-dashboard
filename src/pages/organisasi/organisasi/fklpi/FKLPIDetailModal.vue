<template>
  <BaseDetailModal
    title="Detail Organisasi"
    :item-to-view="itemToView"
    :api-detail-fn="getDetailOrganisasi"
    id-key="id_organisasi"
    @close="$emit('close')"
  >
    <template #detail="{ item }">
      <!-- Header: Lembaga Logo + Nama Organisasi -->
      <div class="text-center mb-4">
        <div
          v-if="item.lembaga && item.lembaga.cover_lembaga"
          class="cover-wrapper mb-3"
        >
          <img
            :src="item.lembaga.cover_lembaga"
            alt="Cover Lembaga"
            class="cover-img"
            @click="showImage(item.lembaga.cover_lembaga)"
            onerror="this.style.display='none'"
          />
        </div>

        <div class="logo-wrapper">
          <img
            v-if="item.lembaga && item.lembaga.logo_lembaga"
            :src="item.lembaga.logo_lembaga"
            alt="Logo Lembaga"
            class="logo-detail-img"
            @click="showImage(item.lembaga.logo_lembaga)"
            onerror="this.src='https://placehold.co/100x100/EBF4FF/7F9CF5?text=Logo'"
          />
          <img
            v-else
            src="https://placehold.co/100x100/EBF4FF/7F9CF5?text=Logo"
            alt="Logo Default"
            class="logo-detail-img"
          />
        </div>

        <h2 class="nama-organisasi mt-3">
          {{ item.nama_organisasi || "Nama Organisasi" }}
        </h2>
      </div>

      <hr />

      <!-- Informasi Umum -->
      <div class="detail-section">
        <h4><i class="fa fa-info-circle me-2"></i>Informasi Umum</h4>
        <div class="row detail-grid-container">
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Lembaga (UPTP/UPTD)</dt>
              <dd>
                <span v-if="item.lembaga && item.lembaga.nama_lembaga">
                  {{ item.lembaga.nama_lembaga }}
                </span>
                <span v-else class="text-muted">-</span>
              </dd>

              <dt>VIN Lembaga</dt>
              <dd>
                <span v-if="item.lembaga && item.lembaga.vin">
                  {{ item.lembaga.vin }}
                </span>
                <span v-else class="text-muted">-</span>
              </dd>

              <dt>Skala</dt>
              <dd>
                <span v-if="item.skala && item.skala.skala">
                  {{ item.skala.skala }}
                </span>
                <span v-else class="text-muted">-</span>
              </dd>
            </dl>
          </div>

          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Wilayah</dt>
              <dd>
                <span v-if="item.wilayah && item.wilayah.nama_wilayah">
                  {{ item.wilayah.nama_wilayah }}
                </span>
                <span v-else class="text-muted">-</span>
              </dd>

              <dt>Koordinat</dt>
              <dd>{{ item.koordinat || "-" }}</dd>

              <dt>Telepon</dt>
              <dd>{{ item.telepon_organisasi || "-" }}</dd>

              <dt>Email</dt>
              <dd>{{ item.email_organisasi || "-" }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <hr />

      <!-- Alamat -->
      <div class="detail-section">
        <h4><i class="fa fa-map-marker me-2"></i>Alamat</h4>
        <div class="text-content">
          {{ item.alamat_organisasi || "Alamat tidak tersedia." }}
        </div>
      </div>

      <hr />

      <!-- Deskripsi -->
      <div class="detail-section">
        <h4><i class="fa fa-file-text me-2"></i>Deskripsi</h4>
        <div class="text-content">
          {{ item.deskripsi_organisasi || "Deskripsi tidak tersedia." }}
        </div>
      </div>

      <hr />

      <!-- Visi & Misi -->
      <div class="detail-section">
        <h4><i class="fa fa-bullseye me-2"></i>Visi</h4>
        <div class="text-content">
          {{ item.visi || "Belum diisi." }}
        </div>
      </div>

      <div class="detail-section">
        <h4><i class="fa fa-list-ol me-2"></i>Misi</h4>
        <div class="text-content">
          {{ item.misi || "Belum diisi." }}
        </div>
      </div>

      <hr />

      <!-- Dasar Hukum -->
      <div class="detail-section">
        <h4><i class="fa fa-gavel me-2"></i>Dasar Hukum</h4>
        <div class="text-content">
          {{ item.dasar_hukum || "Belum diisi." }}
        </div>
      </div>

      <!-- Potensi Wilayah -->
      <div class="detail-section">
        <h4><i class="fa fa-globe me-2"></i>Potensi Wilayah</h4>
        <div class="text-content">
          {{ item.potensi_wilayah || "Belum diisi." }}
        </div>
      </div>

      <hr />

      <!-- Sosial Media -->
      <div class="detail-section">
        <h4><i class="fa fa-share-alt me-2"></i>Sosial Media</h4>
        <div class="row detail-grid-container">
          <div class="col-md-6">
            <dl class="detail-list">
              <dt><i class="fa-brands fa-instagram me-1"></i>Instagram</dt>
              <dd>
                <a
                  v-if="item.instagram_organisasi"
                  :href="item.instagram_organisasi"
                  target="_blank"
                  rel="noopener"
                  >{{ item.instagram_organisasi }}</a
                >
                <span v-else class="text-muted">-</span>
              </dd>

              <dt><i class="fa-brands fa-facebook me-1"></i>Facebook</dt>
              <dd>
                <a
                  v-if="item.facebook_organisasi"
                  :href="item.facebook_organisasi"
                  target="_blank"
                  rel="noopener"
                  >{{ item.facebook_organisasi }}</a
                >
                <span v-else class="text-muted">-</span>
              </dd>
            </dl>
          </div>

          <div class="col-md-6">
            <dl class="detail-list">
              <dt><i class="fa-brands fa-youtube me-1"></i>YouTube</dt>
              <dd>
                <a
                  v-if="item.youtube_organisasi"
                  :href="item.youtube_organisasi"
                  target="_blank"
                  rel="noopener"
                  >{{ item.youtube_organisasi }}</a
                >
                <span v-else class="text-muted">-</span>
              </dd>

              <dt><i class="fa-brands fa-x-twitter me-1"></i>X(Twitter)</dt>
              <dd>
                <a
                  v-if="item.twitter_organisasi"
                  :href="item.twitter_organisasi"
                  target="_blank"
                  rel="noopener"
                  >{{ item.twitter_organisasi }}</a
                >
                <span v-else class="text-muted">-</span>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <hr />

      <!-- Alamat Lembaga -->
      <div
        class="detail-section"
        v-if="item.lembaga && item.lembaga.alamat_lembaga"
      >
        <h4><i class="fa fa-building me-2"></i>Alamat Lembaga</h4>
        <div class="text-content">
          {{ item.lembaga.alamat_lembaga }}
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
import { getDetailOrganisasi } from "@/services/general/organisasi/organisasi";

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
  border-radius: 12px;
  overflow: hidden;
  background-color: #f8f9fa;
  border: 1px solid #eaebec;
}
.cover-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
  transition: opacity 0.2s ease;
}
.cover-img:hover {
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
.nama-organisasi {
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
  min-height: 60px;
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
.detail-list dd a {
  color: #0d6efd;
  text-decoration: none;
  word-break: break-all;
}
.detail-list dd a:hover {
  text-decoration: underline;
}
</style>
