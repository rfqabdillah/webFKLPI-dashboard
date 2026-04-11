<template>
  <BaseDetailModal
    title="Detail Periode Kepengurusan"
    :item-to-view="itemToView"
    :api-detail-fn="getDetailOrganisasiPeriode"
    id-key="id_organisasi_periode"
    @close="$emit('close')"
  >
    <template #detail="{ item }">
      <!-- Header -->
      <div class="text-center mb-4">
        <h2 class="periode-title">
          Periode: {{ item.tahun_awal || "-" }} - {{ item.tahun_akhir || "-" }}
        </h2>
        <h5 class="organisasi-subtitle mt-2 text-primary">
          {{ item.fklpi?.nama_organisasi || "Organisasi FKLPI" }}
        </h5>
      </div>

      <hr />

      <!-- Informasi SK -->
      <div class="detail-section">
        <h4><i class="fa fa-file-text-o me-2"></i>Informasi Surat Keputusan</h4>
        <div class="row detail-grid-container">
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Nomor SK</dt>
              <dd>{{ item.nomor_sk || "-" }}</dd>

              <dt>Tanggal SK</dt>
              <dd>{{ item.tanggal_sk ? formatDate(item.tanggal_sk) : "-" }}</dd>
            </dl>
          </div>

          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Dokumen SK</dt>
              <dd>
                <a
                  v-if="item.file_sk"
                  :href="item.file_sk"
                  target="_blank"
                  class="btn btn-sm btn-outline-danger mt-1"
                >
                  <i class="fa fa-file-pdf-o"></i> Lihat Dokumen SK
                </a>
                <span v-else class="text-muted">-</span>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Detail Organisasi Preview -->
      <div class="detail-section" v-if="item.fklpi">
        <h4><i class="fa fa-building me-2"></i>Detail Organisasi</h4>
        <div class="row detail-grid-container px-3">
          <dl class="detail-list mb-0 col-md-6">
            <dt>Nama Lengkap Organisasi</dt>
            <dd>{{ item.fklpi.nama_organisasi || "-" }}</dd>

            <dt>Alamat</dt>
            <dd>{{ item.fklpi.alamat_organisasi || "-" }}</dd>
          </dl>
          <dl class="detail-list mb-0 col-md-6">
            <dt>Email</dt>
            <dd>{{ item.fklpi.email_organisasi || "-" }}</dd>

            <dt>Telepon</dt>
            <dd>{{ item.fklpi.telepon_organisasi || "-" }}</dd>
          </dl>
        </div>
      </div>
    </template>
  </BaseDetailModal>
</template>

<script setup>
import BaseDetailModal from "@/components/base/BaseDetailModal.vue";
import { getDetailOrganisasiPeriode } from "@/services/general/organisasi/organisasiPeriode";

defineProps({
  itemToView: {
    type: Object,
    required: true,
  },
});

defineEmits(["close"]);

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
</script>

<style scoped>
.periode-title {
  font-weight: 700;
  color: #333;
  margin-bottom: 0.25rem;
}
.organisasi-subtitle {
  font-weight: 500;
}
.detail-section {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}
.detail-section h4 {
  font-size: 1.15rem;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}
.detail-grid-container {
  padding-top: 0.5rem;
}
.detail-list {
  margin-bottom: 0;
}
.detail-list dt {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}
.detail-list dd {
  color: #212529;
  margin-bottom: 1.15rem;
  padding-left: 0;
}
</style>
