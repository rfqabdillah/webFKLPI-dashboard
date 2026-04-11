<template>
  <BaseDetailModal
    title="Detail Pembinaan"
    :item-to-view="itemToView"
    :api-detail-fn="getDetailPembinaan"
    id-key="id_pembinaan"
    @close="$emit('close')"
  >
    <template #detail="{ item }">
      <div class="text-center mb-4">
        <h2 class="nama-pembinaan">
          {{ item.nama_pembinaan || "Nama Pembinaan" }}
        </h2>
        <p class="sub-info text-muted">
          {{ item["jenis-pembinaan"]?.nama_jenis_pembinaan || "-" }}
          &bull;
          {{ item["metode-pembinaan"]?.nama_metode_pembinaan || "-" }}
        </p>
      </div>

      <hr />

      <!-- Detail Jadwal -->
      <div class="detail-section">
        <h4><i class="fa fa-calendar me-2"></i>Detail Jadwal</h4>
        <div class="row detail-grid-container">
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Tanggal Mulai</dt>
              <dd>{{ formatDate(item.tanggal_mulai) }}</dd>

              <dt>Tanggal Selesai</dt>
              <dd>{{ formatDate(item.tanggal_selesai) }}</dd>

              <dt>Batas Pendaftaran</dt>
              <dd>{{ formatDate(item.batas_pendaftaran) }}</dd>
            </dl>
          </div>

          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Jenis Pembinaan</dt>
              <dd>
                {{ item["jenis-pembinaan"]?.nama_jenis_pembinaan || "-" }}
              </dd>

              <dt>Metode Pembinaan</dt>
              <dd>
                {{ item["metode-pembinaan"]?.nama_metode_pembinaan || "-" }}
              </dd>

              <dt>Organisasi FKLPI</dt>
              <dd>{{ item.fklpi?.nama_organisasi || "-" }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <hr />

      <!-- Peserta & Deskripsi -->
      <div class="detail-section">
        <h4><i class="fa fa-users me-2"></i>Peserta & Deskripsi</h4>
        <div class="row detail-grid-container">
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Peserta</dt>
              <dd>{{ item.peserta || "-" }}</dd>
            </dl>
          </div>
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Tanggal Dibuat</dt>
              <dd>{{ formatDate(item.created_at) }}</dd>

              <dt>Terakhir Diupdate</dt>
              <dd>{{ item.updated_at ? formatDate(item.updated_at) : "-" }}</dd>
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
    </template>
  </BaseDetailModal>
</template>

<script setup>
import BaseDetailModal from "@/components/base/BaseDetailModal.vue";
import { getDetailPembinaan } from "@/services/general/pembinaan/pembinaan";

defineProps({
  itemToView: {
    type: Object,
    required: true,
  },
});

defineEmits(["close"]);

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
.nama-pembinaan {
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
