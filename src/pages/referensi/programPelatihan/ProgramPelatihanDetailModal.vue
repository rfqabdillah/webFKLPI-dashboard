<template>
  <BaseDetailModal
    title="Detail Program Pelatihan"
    :item-to-view="itemToView"
    :api-detail-fn="getDetailProgramPelatihan"
    id-key="id_program_pelatihan"
    @close="$emit('close')"
  >
    <template #detail="{ item }">
      <!-- Header: Cover + Nama -->
      <div class="text-center mb-4">
        <div v-if="item.cover" class="cover-wrapper mb-3">
          <img
            :src="item.cover"
            alt="Cover Program"
            class="cover-img"
            @click="showImage(item.cover)"
            onerror="this.src='https://placehold.co/600x200/EBF4FF/7F9CF5?text=Cover'"
          />
        </div>

        <h2 class="nama-program mt-3">
          {{ item.nama_program || "Nama Program" }}
        </h2>
        <p class="sub-info text-muted" v-if="item.kode_program">
          Kode: {{ item.kode_program }}
        </p>
      </div>

      <hr />

      <!-- Informasi Program -->
      <div class="detail-section">
        <h4><i class="fa fa-info-circle me-2"></i>Informasi Program</h4>
        <div class="row detail-grid-container">
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Kode Program</dt>
              <dd>{{ item.kode_program || "-" }}</dd>

              <dt>JP (Jam Pelajaran)</dt>
              <dd>{{ item.jp || "-" }}</dd>

              <dt>KBJI</dt>
              <dd>
                <span v-if="item.kbji && item.kbji.nama_kbji">
                  {{ item.kbji.kode_kbji }} - {{ item.kbji.nama_kbji }}
                </span>
                <span v-else>{{ item.kode_kbji || "-" }}</span>
              </dd>
            </dl>
          </div>

          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Kejuruan</dt>
              <dd>{{ item.kejuruan || "-" }}</dd>

              <dt>Sub Kejuruan</dt>
              <dd>{{ item.sub_kejuruan || "-" }}</dd>

              <dt>Link</dt>
              <dd>
                <a
                  v-if="item.link"
                  :href="item.link"
                  target="_blank"
                  class="text-primary text-decoration-none"
                >
                  <i class="fa fa-external-link me-1"></i>{{ item.link }}
                </a>
                <span v-else>-</span>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <hr />

      <!-- Deskripsi -->
      <div class="detail-section">
        <h4><i class="fa fa-file-text me-2"></i>Deskripsi</h4>
        <div class="text-content">
          {{ item.deskripsi || "-" }}
        </div>
      </div>

      <hr />

      <!-- Timestamp -->
      <div class="detail-section">
        <h4><i class="fa fa-clock-o me-2"></i>Informasi Waktu</h4>
        <div class="row detail-grid-container">
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Tanggal Dibuat</dt>
              <dd>{{ formatDate(item.created_at) }}</dd>
            </dl>
          </div>
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Terakhir Diupdate</dt>
              <dd>{{ item.updated_at ? formatDate(item.updated_at) : "-" }}</dd>
            </dl>
          </div>
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
import { getDetailProgramPelatihan } from "@/services/referensi/programPelatihan";

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

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
.nama-program {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}
.sub-info {
  font-size: 0.95rem;
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
