<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content custom-card-modal" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">Kartu Anggota Pengurus</h5>
        <button
          type="button"
          class="btn-close"
          @click="closeModal"
          aria-label="Close"
        ></button>
      </div>

      <div class="modal-body custom-scrollbar">
        <div class="card-modal-container" v-if="pengurus">
          <!-- Card Design -->
          <div class="id-card" id="kartu-anggota-element">
            <!-- Header -->
            <div class="card-header">
              <div class="logo-container">
                <img :src="pengurus['uptp-uptd']?.logo_lembaga || kemnakerLogo" alt="Logo Lembaga" class="logo" @error="(e) => (e.target.src = kemnakerLogo)" />
              </div>
              <div class="header-text">
                <h2 class="org-name">
                  {{ pengurus.fklpi?.nama_organisasi || "Nama Organisasi" }}
                </h2>
                <p class="org-address">
                  {{ pengurus.fklpi?.alamat_organisasi || "-" }}
                </p>
                <p class="org-region">
                  {{ pengurus.wilayah?.nama_wilayah || "-" }}
                </p>
              </div>
            </div>

            <!-- Body -->
            <div class="card-body">
              <div class="photo-container">
                <img :src="pengurus?.foto_pengurus || 'https://placehold.co/150x200?text=Foto'" alt="Foto Pengurus" class="photo" @error="(e) => (e.target.src = 'https://placehold.co/150x200?text=Foto')" crossorigin="anonymous" />
              </div>
              <div class="details-container">
                <div class="member-name">
                  {{ pengurus.nama_pengurus || "-" }}
                </div>
                <div class="member-role">
                  {{ pengurus.jabatan?.nama_jabatan || "-" }}
                </div>
                <div class="divider"></div>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">Periode</span>
                    <span class="info-value">
                      {{ pengurus["organisasi-periode"]?.tahun_awal || "..." }}
                      &ndash;
                      {{ pengurus["organisasi-periode"]?.tahun_akhir || "..." }}
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Status</span>
                    <span class="info-value">
                      {{
                        pengurus["status-pengurus"]?.nama_status_pengurus || "-"
                      }}
                    </span>
                  </div>
                  <div class="info-item info-item--full">
                    <span class="info-label">Lembaga</span>
                    <span class="info-value">
                      {{ pengurus["uptp-uptd"]?.nama_lembaga || "-" }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Decorative elements -->
            <div class="card-deco card-deco--1"></div>
            <div class="card-deco card-deco--2"></div>
          </div>
        </div>

        <div v-else-if="loading" class="text-center p-4">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2 text-muted">Memuat data kartu anggota...</p>
        </div>
      </div>

      <div class="modal-footer d-flex justify-content-between">
        <div class="d-flex gap-2">
          <button
            type="button"
            class="btn btn-success"
            @click="downloadPNG"
            :disabled="loading || !pengurus"
          >
            <i class="fa-solid fa-image me-1"></i> Download PNG
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="downloadPDF"
            :disabled="loading || !pengurus"
          >
            <i class="fa-solid fa-file-pdf me-1"></i> Download PDF
          </button>
        </div>
        <button type="button" class="btn btn-secondary" @click="closeModal">
          <i class="fa fa-times me-1"></i> Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getDetailOrganisasiPengurus } from "@/services/general/organisasi/organisasiPengurus";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import kemnakerLogo from "@/assets/images/logo/Logo_Kementerian_Ketenagakerjaan.png";
import Swal from "sweetalert2";

const props = defineProps({
  idPengurus: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const pengurus = ref(null);
const loading = ref(false);
function closeModal() {
  emit("close");
}

const fetchData = async () => {
  if (!props.idPengurus) return;

  loading.value = true;
  pengurus.value = null;

  try {
    const res = await getDetailOrganisasiPengurus(props.idPengurus);

    let rawData = Array.isArray(res.data) ? res.data[0] : res.data;

    if (rawData && rawData.data && Array.isArray(rawData.data)) {
      pengurus.value = rawData.data[0];
    } else if (Array.isArray(rawData)) {
      pengurus.value = rawData[0];
    } else {
      pengurus.value = rawData;
    }
  } catch (error) {
    console.error("Gagal memuat detail kartu anggota:", error);
  } finally {
    loading.value = false;
  }
};

const downloadPNG = async () => {
  const element = document.getElementById("kartu-anggota-element");
  if (!element) return;

  Swal.fire({
    title: "Sedang Memproses...",
    text: "Harap tunggu, gambar sedang di-generate.",
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const canvas = await html2canvas(element, {
      scale: 4,
      useCORS: true,
      allowTaint: true,
    });
    const link = document.createElement("a");
    link.download = `Kartu_Anggota_${
      pengurus.value?.nama_pengurus || "Pengurus"
    }.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    Swal.fire({
      title: "Berhasil!",
      text: "Kartu Anggota berhasil diunduh.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error("Gagal download PNG:", err);
    Swal.fire({
      title: "Gagal!",
      text: "Terjadi kesalahan saat menggenerate gambar.",
      icon: "error",
    });
  }
};

const downloadPDF = async () => {
  const element = document.getElementById("kartu-anggota-element");
  if (!element) return;

  Swal.fire({
    title: "Sedang Memproses...",
    text: "Harap tunggu, PDF sedang di-generate.",
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const canvas = await html2canvas(element, {
      scale: 4, 
      useCORS: true,
      allowTaint: true,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [85.6, 54],
    });

    pdf.addImage(imgData, "PNG", 0, 0, 85.6, 54);
    pdf.save(
      `Kartu_Anggota_${pengurus.value?.nama_pengurus || "Pengurus"}.pdf`,
    );

    Swal.fire({
      title: "Berhasil!",
      text: "Kartu Anggota berhasil diunduh.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error("Gagal download PDF:", err);
    Swal.fire({
      title: "Gagal!",
      text: "Terjadi kesalahan saat menggenerate PDF.",
      icon: "error",
    });
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(10, 15, 30, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content.custom-card-modal {
  background: #f4f6fb;
  border-radius: 14px;
  width: auto;
  min-width: 560px;
  max-width: 90vw;
  max-height: 90vh;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
}

.modal-header,
.modal-footer {
  padding: 1rem 1.25rem;
  flex-shrink: 0;
  background: #ffffff;
}

.modal-header {
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 14px 14px 0 0;
}

.modal-title {
  font-weight: 700;
  font-size: 1rem;
  color: #1a1a2e;
}

.modal-footer {
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  border-radius: 0 0 14px 14px;
}

.modal-body {
  padding: 1.75rem 2rem;
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f6fb;
}

.btn-close {
  background: transparent
    url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e")
    center/1em auto no-repeat;
  border: 0;
  border-radius: 0.25rem;
  opacity: 0.5;
  width: 1em;
  height: 1em;
  padding: 0.25em;
  cursor: pointer;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
}

/* =====================
   Card Container
===================== */
.card-modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.id-card {
  width: 520px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04), 0 20px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
  position: relative;
}

/* =====================
   Card Header — Gradient
===================== */
.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(135deg, #1a1a6e, #0d6efd, #00b4d8);
  color: #ffffff;
  padding: 18px 22px;
  position: relative;
  z-index: 2;
  overflow: hidden;
}

/* golden bottom border line */
.card-header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #f39c12, #f1c40f, #f39c12);
}

.logo-container {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}

.logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.header-text {
  flex-grow: 1;
  min-width: 0;
}

.org-name {
  margin: 0 0 3px;
  font-size: 13.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.org-address {
  margin: 0 0 1px;
  font-size: 10.5px;
  font-weight: 400;
  opacity: 0.85;
  line-height: 1.3;
}

.org-region {
  margin: 0;
  font-size: 10.5px;
  font-weight: 600;
  opacity: 0.95;
  letter-spacing: 0.3px;
}

/* =====================
   Card Body
===================== */
.card-body {
  display: flex;
  gap: 20px;
  padding: 20px 22px;
  flex-grow: 1;
  align-items: flex-start;
  background: #ffffff;
  position: relative;
  z-index: 2;
}

.photo-container {
  width: 95px;
  height: 120px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border: 3px solid #e8edf5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.photo {
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  max-width: none;
  object-fit: cover;
}

.details-container {
  flex-grow: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.member-name {
  font-size: 17px;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
  letter-spacing: -0.3px;
}

.member-role {
  font-size: 12px;
  font-weight: 600;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.divider {
  width: 36px;
  height: 3px;
  background: linear-gradient(90deg, #0d6efd, #00b4d8);
  border-radius: 2px;
  margin: 4px 0;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-item--full {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 9.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #9ca3af;
}

.info-value {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-item--full .info-value {
  white-space: normal;
  font-size: 11px;
  line-height: 1.4;
}

/* =====================
   Decorative Elements
===================== */
.card-deco {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
}

.card-deco--1 {
  width: 180px;
  height: 180px;
  bottom: -70px;
  right: -50px;
  background: radial-gradient(
    circle,
    rgba(13, 110, 253, 0.06) 0%,
    transparent 70%
  );
}

.card-deco--2 {
  width: 100px;
  height: 100px;
  bottom: -20px;
  left: 10px;
  background: radial-gradient(
    circle,
    rgba(0, 180, 216, 0.05) 0%,
    transparent 70%
  );
}
</style>
