<template>
  <BaseDetailModal
    title="Detail Dokumen"
    :item-to-view="itemToView"
    :api-detail-fn="getDetailDokumen"
    id-key="id_dokumen"
    @close="$emit('close')"
  >
    <template #detail="{ item }">
      <div class="text-center mb-4">
        <img
          v-if="item.gambar_dokumen"
          :src="item.gambar_dokumen"
          alt="Poster Dokumen"
          class="foto"
          onerror="this.src='https://placehold.co/250x150/EBF4FF/7F9CF5?text=Poster'"
        />
        <img
          v-else
          src="https://placehold.co/250x150/EBF4FF/7F9CF5?text=Poster'"
          alt="Poster Default"
          class="foto"
        />
        <h2 class="nama-dokumen mt-3">
          {{ item.nama_dokumen || "Nama Dokumen" }}
        </h2>
      </div>

      <hr />

      <div class="detail-section">
        <h4><i class="fa fa-info-circle me-2"></i>Detail Publikasi & Status</h4>
        <div class="row detail-grid-container">
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Organisasi</dt>
              <dd>{{ item.fklpi?.nama_organisasi || "-" }}</dd>

              <dt>Tanggal Upload</dt>
              <dd>{{ formatDate(item.created_at) || "-" }}</dd>
            </dl>
          </div>

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
            </dl>
          </div>
        </div>

        <div class="row mt-3" v-if="item.file_dokumen">
          <div class="col-12">
            <dl class="detail-list">
              <dt>File Dokumen</dt>
              <dd>
                <a
                  :href="item.file_dokumen"
                  target="_blank"
                  class="btn btn-sm btn-outline-primary"
                >
                  <i class="fa fa-file-pdf-o me-1"></i> Download / Lihat Dokumen
                </a>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <hr />

      <div class="detail-section">
        <h4><i class="fa fa-file-text-o me-2"></i>Deskripsi</h4>
        <div class="row">
          <div class="mb-3">
            <div class="text-content">
              {{ item.deskripsi_dokumen || "Deskripsi tidak tersedia." }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseDetailModal>
</template>

<script setup>
import BaseDetailModal from "@/components/base/BaseDetailModal.vue";
import { getDetailDokumen } from "@/services/general/website/dokumen";
import { formatDate } from "@/utils/formatDate";

defineProps({
  itemToView: {
    type: Object,
    required: true,
  },
});

defineEmits(["close"]);
</script>

<style scoped>
.foto {
  display: block;
  margin: 0 auto;
  max-height: 150px;
  max-width: 250px;
  object-fit: contain;
  border-radius: 6px;
}
.nama-dokumen {
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
  height: 100%;
  min-height: 150px;
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
.detail-list dd .badge {
  font-size: 0.85em;
  padding: 0.5em 0.75em;
  color: #fff;
}
.detail-list dd .badge.text-dark {
  color: #000 !important;
}
</style>
