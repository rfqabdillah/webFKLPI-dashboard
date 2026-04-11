<template>
  <BaseDetailModal
    title="Detail Data Pengguna"
    :item-to-view="itemToView"
    :api-detail-fn="getDetailPengguna"
    id-key="id_pengguna"
    @close="$emit('close')"
  >
    <template #detail="{ item }">
      <div class="text-center mb-4">
        <img
          v-if="item.foto"
          :src="item.foto"
          alt="Foto Pengguna"
          class="foto rounded-circle"
          style="width: 150px; height: 150px; object-fit: cover"
          @error="(e) => (e.target.style.display = 'none')"
        />
        <div
          v-else
          class="foto rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold"
          :style="{
            backgroundColor: getRandomColor(item.nama),
            width: '150px',
            height: '150px',
          }"
        >
          <span style="font-size: 3rem">{{ getInitials(item.nama) }}</span>
        </div>
        <h2 class="nama-lengkap mt-3">
          {{ item.nama || "Nama Pengguna" }}
        </h2>
        <h5 class="nama-lengkap-en text-muted fw-normal">
          <i class="fa fa-id-badge me-1"></i>
          {{ item.peran?.nama_peran || "-" }}
        </h5>
        <span
          class="badge mt-2"
          :class="{
            'bg-success': item.status === 'Aktif',
            'bg-danger': item.status === 'Tidak Aktif',
            'bg-secondary': !item.status,
          }"
        >
          {{ item.status || "Tidak Aktif" }}
        </span>
      </div>

      <hr />

      <div class="detail-section">
        <h4><i class="fa fa-id-card me-2"></i>Identitas</h4>
        <div class="row detail-grid-container">
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>NIK</dt>
              <dd>{{ item.nik || "-" }}</dd>

              <dt>Jenis Kelamin</dt>
              <dd>
                {{ item["jenis-kelamin"]?.nama_jenis_kelamin || "-" }}
              </dd>

              <dt>Golongan Darah</dt>
              <dd>
                {{ item["golongan-darah"]?.nama_golongan_darah || "-" }}
              </dd>
            </dl>
          </div>

          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Tempat, Tanggal Lahir</dt>
              <dd>
                {{ item.tempat_lahir || ""
                }}{{ item.tempat_lahir && item.tanggal_lahir ? ", " : ""
                }}{{ formatDate(item.tanggal_lahir) || "-" }}
              </dd>

              <dt>Peran</dt>
              <dd>{{ item.peran?.nama_peran || "-" }}</dd>

              <dt>Verifikasi</dt>
              <dd>{{ item.verifikasi || "-" }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <hr />

      <div class="detail-section">
        <h4><i class="fa fa-address-book me-2"></i>Kontak & Alamat</h4>
        <div class="row detail-grid-container">
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Email</dt>
              <dd>{{ item.email || "-" }}</dd>

              <dt>Telepon</dt>
              <dd>{{ item.telepon || "-" }}</dd>
            </dl>
          </div>

          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Alamat</dt>
              <dd>{{ item.alamat || "-" }}</dd>

              <dt>Wilayah</dt>
              <dd>
                <span v-if="item.wilayah && item.wilayah.nama_wilayah">
                  {{ item.wilayah.nama_wilayah }}
                </span>
                <span v-else>-</span>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <hr />

      <div class="detail-section">
        <h4><i class="fa fa-building me-2"></i>Organisasi</h4>
        <div class="row detail-grid-container">
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Organisasi FKLPI</dt>
              <dd>{{ item.fklpi?.nama_organisasi || "-" }}</dd>

              <dt>Perusahaan</dt>
              <dd>{{ item.perusahaan?.nama_perusahaan || "-" }}</dd>
            </dl>
          </div>
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Lembaga</dt>
              <dd>{{ item.lembaga?.nama_lembaga || "-" }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <hr />

      <div class="detail-section" v-if="item.tentang_saya">
        <h4><i class="fa fa-user me-2"></i>Tentang Saya</h4>
        <div class="text-content">{{ item.tentang_saya }}</div>
      </div>

      <div class="detail-section" v-if="item.bukti">
        <h4><i class="fa fa-file me-2"></i>Bukti</h4>
        <a
          :href="item.bukti"
          target="_blank"
          class="btn btn-outline-primary btn-sm"
        >
          <i class="fa fa-download me-1"></i>Lihat / Download Bukti
        </a>
      </div>

      <hr />

      <div class="detail-section">
        <h4><i class="fa fa-info-circle me-2"></i>Informasi Sistem</h4>
        <div class="row detail-grid-container">
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Bergabung Sejak</dt>
              <dd>{{ formatDate(item.created_at) || "-" }}</dd>

              <dt>Last Login</dt>
              <dd>{{ item.last_login ? formatDate(item.last_login) : "-" }}</dd>
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
</template>

<script setup>
import BaseDetailModal from "@/components/base/BaseDetailModal.vue";
import { getDetailPengguna } from "@/services/referensi/pengguna";
import { formatDate } from "@/utils/formatDate";
import { getInitials, getRandomColor } from "@/utils/avatarUtils";

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
.nama-lengkap {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}
.nama-lengkap-en {
  font-size: 1.1rem;
  margin-top: 0;
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
