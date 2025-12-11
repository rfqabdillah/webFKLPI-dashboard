<template>
  <div class="col-12">
    <div class="card">
      <div class="card-body">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Memuat detail agenda...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-5">
          <i class="fa fa-exclamation-circle text-danger fa-3x mb-3"></i>
          <p class="text-danger">{{ error }}</p>
          <router-link to="/list-agenda" class="btn btn-outline-primary">
            Kembali ke Daftar Agenda
          </router-link>
        </div>

        <!-- Content -->
        <div v-else-if="data" class="row">
          <!-- Main Content -->
          <div class="col-lg-8">
            <!-- Back Button -->
            <div class="mb-3">
              <router-link
                to="/list-agenda"
                class="btn btn-outline-primary px-4"
              >
                <i class="fa fa-arrow-left me-2"></i> Kembali
              </router-link>
            </div>

            <!-- Poster Image -->
            <div class="mb-4">
              <img
                :src="data.image"
                :alt="data.title"
                class="img-fluid rounded-3 w-100"
                style="max-height: 400px; object-fit: cover"
                @error="handleImageError"
              />
            </div>

            <!-- Category Badge -->
            <div class="mb-3">
              <span
                class="badge bg-primary-subtle text-primary px-3 py-2 rounded-2"
                style="font-size: 14px"
              >
                {{ data.kategori || "Umum" }}
              </span>
            </div>

            <!-- Title -->
            <h4 class="fw-medium text-dark mb-3">{{ data.title }}</h4>

            <!-- Info List -->
            <div class="agenda-info-list mb-4">
              <div class="d-flex align-items-center mb-2">
                <i class="fa fa-calendar text-primary me-2"></i>
                <span class="text-muted">Tanggal Pelaksanaan: </span>
                <span class="text-dark fw-medium ms-1">{{
                  formatDate(data.implementation_date)
                }}</span>
              </div>
              <div class="d-flex align-items-center mb-2">
                <i class="fa fa-clock-o text-primary me-2"></i>
                <span class="text-muted">Batas Pendaftaran: </span>
                <span class="text-dark fw-medium ms-1">{{
                  formatDate(data.registration_deadline)
                }}</span>
              </div>
              <div class="d-flex align-items-center mb-2">
                <i class="fa fa-map-marker text-primary me-2"></i>
                <span class="text-muted">Tempat: </span>
                <span class="text-dark fw-medium ms-1">{{
                  data.place || "-"
                }}</span>
              </div>
            </div>

            <hr class="my-4" />

            <!-- Content / Description -->
            <div class="agenda-content" v-html="data.desc"></div>

            <!-- Action Buttons -->
            <div class="mt-4 d-flex gap-3">
              <!-- Already Registered -->
              <button v-if="isRegistered" class="btn btn-success px-4" disabled>
                <i class="fa fa-check-circle me-2"></i> Terdaftar
              </button>
              <!-- Not Registered -->
              <button
                v-else
                @click="registerAgenda"
                class="btn btn-primary px-4"
                :disabled="isRegistering"
              >
                <span v-if="isRegistering">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Mendaftar...
                </span>
                <span v-else>
                  <i class="fa fa-check-circle me-2"></i> Daftar Sekarang
                </span>
              </button>
              <button @click="downloadPoster" class="btn btn-light border px-4">
                <i class="fa fa-download me-2"></i> Download Poster
              </button>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <div class="sidebar-sticky">
              <AgendaDetailPageSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";
import AgendaDetailPageSidebar from "@/components/base/default/agendaDetailPageSidebar.vue";
import { formatDate } from "@/utils/formatDate";
import { getDetailEvent } from "@/services/public/eventsPublic";
import {
  addEventUser,
  getEventUsers,
} from "@/services/general/eventUsers/eventUsers";

const route = useRoute();

// Constants
const STATUS_TERDAFTAR_ID = "3f2a882a-7ddb-4ac8-a88c-25693dc61571";

// State
const data = ref(null);
const isLoading = ref(false);
const isRegistering = ref(false);
const isRegistered = ref(false);
const error = ref(null);

// Default placeholder
const defaultPosterUrl =
  "https://placehold.co/800x400/EBF4FF/7F9CF5?text=Agenda";

// Fetch Detail Agenda
const fetchDetail = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await getDetailEvent(route.params.id);

    const item = response.data?.[0]?.data?.[0];

    if (!item) {
      error.value = "Agenda tidak ditemukan.";
      return;
    }

    // Map response to data
    data.value = {
      id: item.id_agenda,
      image: item.poster || defaultPosterUrl,
      kategori: item.kategori_agenda?.nama_kategori_agenda || "",
      implementation_date: item.tanggal_pelaksanaan,
      registration_deadline: item.tanggal_batas_pendaftaran,
      place: item.tempat_pelaksanaan,
      title: item.judul,
      title_en: item.judul_en,
      desc: item.konten,
      desc_en: item.konten_en,
    };
  } catch (err) {
    console.error("Error fetching agenda data:", err);
    error.value = "Gagal memuat detail agenda. Silakan coba lagi.";
  } finally {
    isLoading.value = false;
  }

  // Check if user is already registered
  await checkRegistration();
};

// Check if user is already registered for this agenda
const checkRegistration = async () => {
  const userDataString = localStorage.getItem("userData");
  if (!userDataString) return;

  const userData = JSON.parse(userDataString);
  const userId = userData?.data?.[0]?.id_pengguna;

  if (!userId || !data.value?.id) return;

  try {
    const response = await getEventUsers({
      filter: `id_pengguna=${userId},id_agenda=${data.value.id}`,
    });

    // Check if there's any registration data
    const registrations = response.data?.[0]?.data || [];
    isRegistered.value = registrations.length > 0;
  } catch (err) {
    console.error("Error checking registration:", err);
    // Silently fail - assume not registered
    isRegistered.value = false;
  }
};

// Handle image error
const handleImageError = (event) => {
  event.target.src = defaultPosterUrl;
};

// Download poster function - saves directly to user's downloads folder
const downloadPoster = async () => {
  if (!data.value?.image) return;

  const imageUrl = data.value.image;
  const fileName = `poster-${data.value.title || "agenda"}.jpg`;

  try {
    const response = await fetch(imageUrl, { mode: "cors" });

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      return;
    }
  } catch {
    // CORS or network error - use fallback
  }

  // Fallback: open in new tab for manual save
  window.open(imageUrl, "_blank");
};

// Register for agenda function
const registerAgenda = async () => {
  // Get user data from localStorage
  const userDataString = localStorage.getItem("userData");
  if (!userDataString) {
    Swal.fire({
      icon: "warning",
      title: "Belum Login",
      text: "Silakan login terlebih dahulu untuk mendaftar agenda.",
      confirmButtonColor: "#7366ff",
    });
    return;
  }

  const userData = JSON.parse(userDataString);
  const userId = userData?.data?.[0]?.idpengguna;

  if (!userId) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Data pengguna tidak ditemukan. Silakan login ulang.",
      confirmButtonColor: "#7366ff",
    });
    return;
  }

  if (!data.value?.id) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Data agenda tidak ditemukan.",
      confirmButtonColor: "#7366ff",
    });
    return;
  }

  // Show confirmation dialog
  const result = await Swal.fire({
    icon: "question",
    title: "Konfirmasi Pendaftaran",
    html: `Apakah Anda yakin ingin mendaftar untuk agenda:<br><br><strong>${data.value.title}</strong>?`,
    showCancelButton: true,
    confirmButtonText: "Ya, Daftar",
    cancelButtonText: "Batal",
    confirmButtonColor: "#7366ff",
    cancelButtonColor: "#efefef",
  });

  if (!result.isConfirmed) return;

  // Proceed with registration
  isRegistering.value = true;

  try {
    const formData = new FormData();
    formData.append("record[id_agenda]", data.value.id);
    formData.append("record[id_pengguna]", userId);
    formData.append("record[id_status]", STATUS_TERDAFTAR_ID);

    await addEventUser(formData);

    // Set registered status
    isRegistered.value = true;

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Anda telah berhasil mendaftar untuk agenda ini.",
      confirmButtonColor: "#7366ff",
    });
  } catch (err) {
    console.error("Registration error:", err);

    const errorMessage =
      err.response?.data?.message ||
      "Gagal mendaftar agenda. Silakan coba lagi.";

    Swal.fire({
      icon: "error",
      title: "Gagal Mendaftar",
      text: errorMessage,
      confirmButtonColor: "#7366ff",
    });
  } finally {
    isRegistering.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchDetail();
});
</script>

<style scoped>
.agenda-content {
  line-height: 1.8;
  color: #333;
}

.agenda-content :deep(p) {
  margin-bottom: 1rem;
}

.agenda-content :deep(ul),
.agenda-content :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.agenda-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.bg-primary-subtle {
  background-color: rgba(115, 102, 255, 0.1) !important;
}

.text-primary {
  color: #7366ff !important;
}

.sidebar-sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 100px;
}
</style>
