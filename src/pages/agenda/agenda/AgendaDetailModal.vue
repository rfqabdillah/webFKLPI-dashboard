<template>
  <BaseDetailModal
    title="Detail Agenda"
    :item-to-view="itemToView"
    :api-detail-fn="getDetailAgenda"
    id-key="id_agenda"
    @close="$emit('close')"
  >
    <template #detail="{ item }">
      <div class="text-center mb-4">
        <img
          v-if="item.poster"
          :src="item.poster"
          alt="Poster Agenda"
          class="poster-img"
          @click="showImage(item.poster)"
          onerror="this.src='https://placehold.co/400x200/EBF4FF/7F9CF5?text=Poster'"
        />
        <img
          v-else
          src="https://placehold.co/400x200/EBF4FF/7F9CF5?text=Poster"
          alt="Poster Default"
          class="poster-img"
        />

        <h2 class="nama-agenda mt-3">
          {{ item.judul || "Judul Agenda" }}
        </h2>
        <h5 class="nama-agenda-en text-muted fw-normal">
          {{ item.judul_en || "" }}
        </h5>
        <p class="merk">
          {{
            item["kategori-agenda"]?.nama_kategori_agenda ||
            "Kategori tidak tersedia"
          }}
        </p>
      </div>

      <hr />

      <!-- Detail Pelaksanaan -->
      <div class="detail-section">
        <h4><i class="fa fa-calendar me-2"></i>Detail Pelaksanaan</h4>
        <div class="row detail-grid-container">
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Tanggal Pelaksanaan</dt>
              <dd>{{ formatDate(item.tanggal_pelaksanaan) }}</dd>

              <dt>Tempat Pelaksanaan</dt>
              <dd>{{ item.tempat_pelaksanaan || "-" }}</dd>

              <dt>Batas Pendaftaran</dt>
              <dd>{{ formatDate(item.tanggal_batas_pendaftaran) }}</dd>
            </dl>
          </div>

          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Kategori Agenda</dt>
              <dd>
                {{ item["kategori-agenda"]?.nama_kategori_agenda || "-" }}
              </dd>

              <dt>Organisasi FKLPI</dt>
              <dd>{{ item.fklpi?.nama_organisasi || "-" }}</dd>

              <dt>Penulis</dt>
              <dd>{{ item.pengguna?.nama || "-" }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <hr />

      <!-- Detail Publikasi & Status -->
      <div class="detail-section">
        <h4><i class="fa fa-info-circle me-2"></i>Detail Publikasi & Status</h4>
        <div class="row detail-grid-container">
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Status Tayang</dt>
              <dd>
                <span
                  class="badge"
                  :class="{
                    'bg-success': item.tayang === 'Tayang',
                    'bg-warning text-dark': item.tayang === 'Draft',
                    'bg-light text-dark':
                      item.tayang !== 'Tayang' && item.tayang !== 'Draft',
                  }"
                >
                  {{ item.tayang || "N/A" }}
                </span>
              </dd>

              <dt>Status Flash</dt>
              <dd>{{ item.flash == "1" ? "Aktif" : "Nonaktif" }}</dd>
            </dl>
          </div>

          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Slug</dt>
              <dd>{{ item.slug || "-" }}</dd>

              <dt>Tanggal Dibuat</dt>
              <dd>{{ formatDate(item.created_at) }}</dd>

              <dt>Terakhir Diupdate</dt>
              <dd>{{ item.updated_at ? formatDate(item.updated_at) : "-" }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <hr />

      <!-- Konten (Bahasa) -->
      <div class="detail-section">
        <h4><i class="fa fa-file-text me-2"></i>Konten (Bahasa)</h4>
        <div class="text-content" v-html="item.konten || '-'"></div>
      </div>

      <!-- Konten (English) -->
      <div class="detail-section" v-if="item.konten_en">
        <h4><i class="fa fa-file-text me-2"></i>Konten (English)</h4>
        <div class="text-content" v-html="item.konten_en"></div>
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
import { getDetailAgenda } from "@/services/general/agenda/agenda";
import { formatDate } from "@/utils/formatDate";

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
.poster-img {
  display: block;
  margin: 0 auto;
  max-height: 200px;
  max-width: 100%;
  object-fit: contain;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}
.poster-img:hover {
  opacity: 0.85;
}
.nama-agenda {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}
.nama-agenda-en {
  font-size: 1rem;
}
.merk {
  font-size: 0.95rem;
  color: #6c757d;
  margin-bottom: 0;
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
}
.text-content :deep(p) {
  margin-bottom: 0.75rem;
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
