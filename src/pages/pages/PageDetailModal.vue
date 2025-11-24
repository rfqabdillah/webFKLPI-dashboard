<template>
  <BaseDetailModal
    title="Detail Data Halaman"
    :item-to-view="itemToView"
    :api-detail-fn="getDetailPage"
    id-key="idhalaman" 
    @close="$emit('close')"
  >
    <template #detail="{ item }">
      
      <div class= "text-center mb-4">
        <img
          v-if="item.gambarutama" 
          :src="item.gambarutama" 
          alt="Gambar Utama Halaman" 
          class="foto"
          onerror="this.src='https://placehold.co/250x150/EBF4FF/7F9CF5?text=Gambar'"
        />
        <img
          v-else
          src="https://placehold.co/250x150/EBF4FF/7F9CF5?text=Gambar'"
          alt="Gambar Default"
          class="foto"
        />
        <h2 class="nama-barang mt-3">
          {{ item.judul || 'Judul Halaman' }} 
        </h2>
        <h5 class="nama-barang-en text-muted fw-normal">
          {{ item.judul_en || 'Judul English' }} 
        </h5>
      </div>

      <hr>

      <div class="detail-section">
        <h4><i class="fa fa-info-circle me-2"></i>Detail Publikasi & Status</h4> 
        <div class="row detail-grid-container">
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Pembuat</dt>
              <dd>{{  item.users?.nama || '-' }}</dd>

              <dt>Tanggal Dibuat</dt>
              <dd>{{ formatDate(item.created_at) || '-' }}</dd>

              <dt>Kata Kunci</dt>
              <dd>{{ item.katakunci || '-' }}</dd>
            </dl>
          </div>
          
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Status Tayang</dt>
              <dd>
                <span class="badge" :class="{
                  'bg-success': item.tayang === 'Tayang',
                  'bg-warning text-dark': item.tayang === 'Draft',
                  'bg-light text-dark': item.tayang !== 'Tayang' && item.tayang !== 'Draft'
                }">
                  {{ item.tayang || 'N/A' }} 
                </span>
              </dd>

              <dt>Slug</dt>
              <dd>{{ item.slug || '-' }}</dd>

              </dl>
          </div>
        </div>
      </div>

      <hr>

      <div class="detail-section">
        <h4><i class="fa fa-file-text-o me-2"></i>Konten Halaman</h4> 
        <div class="row">
          <div class="mb-3">
            <h5>Konten (ID)</h5>
            
            <div class="text-content" v-if="item.konten" v-html="item.konten"></div>
            <div class="text-content" v-else>
              <span class="text-muted">Konten tidak tersedia.</span>
            </div>

          </div>
          <div class="mb-3">
            <h5>Konten (EN)</h5>

            <div class="text-content" v-if="item.konten_en" v-html="item.konten_en"></div>
            <div class="text-content" v-else>
              <span class="text-muted">Konten tidak tersedia.</span>
            </div>
            
          </div>
        </div>
      </div>
    </template>
  </BaseDetailModal>
</template>

<script setup>
import BaseDetailModal from '@/components/base/BaseDetailModal.vue';
import { getDetailPage } from '@/services/general/website/pages/pages'; 
import { formatDate } from '@/utils/formatDate';

defineProps({
  itemToView: {
    type: Object,
    required: true
  }
});

defineEmits(['close']);
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
.nama-barang {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}
.nama-barang-en {
  font-size: 1.1rem;
  font-style: italic;
  margin-top: 0;
}
.merk {
  color: #6c757d;
  font-size: 1.1rem;
  margin-top: 0.5rem;
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
.detail-section h5 {
  font-size: 1rem;
  font-weight: 500;
  color: #555;
}
.text-content {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  color: #212529;
  line-height: 1.6;
  height: 100%;
  min-height: 150px;
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

/* Style :deep untuk Quill (Sudah Benar) */
.text-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}
.text-content :deep(ul),
.text-content :deep(ol) {
  padding-left: 2rem; 
  margin-bottom: 1rem;
}
.text-content :deep(li) {
  margin-bottom: 0.5rem; 
}
.text-content :deep(blockquote) {
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  border-left: 4px solid #ccc;
  color: #666;
  font-style: italic;
  background-color: #f9f9f9;
}
.text-content :deep(pre),
.text-content :deep(code) {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
}
.text-content :deep(.ql-align-center) {
  text-align: center;
}
.text-content :deep(.ql-align-right) {
  text-align: right;
}
.text-content :deep(.ql-align-justify) {
  text-align: justify;
}
</style>