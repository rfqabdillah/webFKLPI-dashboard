<template>
  <div class="col-12">
    <div class="card">
      <div class="card-body">
        <!-- Loading State with Skeleton -->
        <!-- Loading State with Skeleton -->
        <SkeletonGroup v-if="isLoading" type="agenda-detail" />

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-5">
          <i class="fa fa-exclamation-circle text-danger fa-3x mb-3"></i>
          <p class="text-danger">{{ error }}</p>
          <router-link to="/list-agenda" class="btn btn-outline-primary">
            {{ $t("Back to Programs List") }}
          </router-link>
        </div>

        <div v-else-if="data" class="row align-items-start detail-layout">
          <div class="col-main">
            <!-- Back Button -->
            <div class="mb-3">
              <router-link
                to="/list-agenda"
                class="btn btn-outline-primary px-4"
              >
                <i class="fa fa-arrow-left me-2"></i> {{ $t("Back") }}
              </router-link>
            </div>

            <!-- Poster Image -->
            <div class="mb-4">
              <img
                :src="data.image"
                :alt="data.title"
                class="img-fluid rounded-3 w-100"
                @error="handleImageError"
              />
            </div>

            <!-- Category Badge -->
            <div class="mb-3">
              <span
                class="badge px-3 py-2 rounded-2"
                style="
                  font-size: 14px;
                  background-color: rgba(21, 64, 106, 0.15);
                  color: #15406a;
                "
              >
                {{
                  $i18n.locale === "en"
                    ? data.kategori_en || data.kategori || "General"
                    : data.kategori || "Umum"
                }}
              </span>
            </div>

            <!-- Title -->
            <h4 class="fw-medium text-dark mb-3">
              {{
                $i18n.locale === "en" ? data.title_en || data.title : data.title
              }}
            </h4>

            <!-- Info List -->
            <div class="agenda-info-list mb-4">
              <div class="d-flex align-items-center mb-2">
                <i class="fa fa-calendar me-2" style="color: #15406a"></i>
                <span class="text-muted"
                  >{{ $t("Implementation Date") }}:
                </span>
                <span class="text-dark fw-medium ms-1">{{
                  formatDate(data.implementation_date, $i18n.locale)
                }}</span>
              </div>
              <div class="d-flex align-items-center mb-2">
                <i class="fa fa-clock-o me-2" style="color: #15406a"></i>
                <span class="text-muted"
                  >{{ $t("Registration Deadline") }}:
                </span>
                <span class="text-dark fw-medium ms-1">{{
                  formatDate(data.registration_deadline, $i18n.locale)
                }}</span>
              </div>
              <div class="d-flex align-items-center mb-2">
                <i class="fa fa-map-marker me-2" style="color: #15406a"></i>
                <span class="text-muted">{{ $t("Location") }}: </span>
                <span class="text-dark fw-medium ms-1">{{
                  data.place || "-"
                }}</span>
              </div>
            </div>

            <!-- Registration Status Card -->
            <div
              v-if="isRegistered"
              class="registration-status-card mb-4"
              :class="getCardClass(registrationStatusId)"
            >
              <div class="status-icon">
                <i :class="getStatusIcon(registrationStatusId)"></i>
              </div>
              <div class="status-content">
                <div class="status-header">
                  <span class="status-label">{{
                    $t("Your Registration Status")
                  }}</span>
                  <span
                    class="status-badge"
                    :class="getStatusClass(registrationStatusId)"
                  >
                    {{ registrationStatus }}
                  </span>
                </div>
                <p class="status-message">
                  {{ getStatusMessage(registrationStatusId) }}
                </p>
              </div>
            </div>

            <hr class="my-4" />

            <!-- Content / Description -->
            <div
              class="agenda-content"
              v-html="
                $i18n.locale === 'en' ? data.desc_en || data.desc : data.desc
              "
            ></div>

            <!-- Action Buttons -->
            <div class="mt-4 d-flex gap-3 flex-wrap">
              <!-- Deadline Passed Info -->
              <div
                v-if="isDeadlinePassed && !isRegistered"
                class="alert alert-warning w-100 mb-2"
              >
                <i class="fa fa-exclamation-triangle me-2"></i>
                {{ $t("Registration deadline has passed") }}
              </div>

              <!-- Cannot Cancel Info -->
              <div
                v-if="isRegistered && !canCancel"
                class="alert alert-info w-100 mb-2"
              >
                <i class="fa fa-info-circle me-2"></i>
                {{ getCancelDisabledReason() }}
              </div>

              <!-- Already Registered - Show Cancel Button -->
              <template v-if="isRegistered">
                <button class="btn btn-success px-4" disabled>
                  <i class="fa fa-check-circle me-2"></i> {{ $t("Registered") }}
                </button>
                <!-- Cancel Button - Always show but disabled for non-Terdaftar status -->
                <button
                  @click="cancelRegistration"
                  class="btn px-4"
                  :class="
                    canCancel ? 'btn-outline-danger' : 'btn-outline-secondary'
                  "
                  :disabled="!canCancel || isCancelling"
                  :title="!canCancel ? getCancelDisabledReason() : ''"
                >
                  <span v-if="isCancelling">
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    {{ $t("Cancelling") }}...
                  </span>
                  <span v-else>
                    <i class="fa fa-times-circle me-2"></i>
                    {{ $t("Batalkan") }}
                  </span>
                </button>
              </template>
              <!-- Not Registered -->
              <button
                v-else
                @click="registerAgenda"
                class="btn px-4"
                :class="isDeadlinePassed ? 'btn-secondary' : 'btn-primary'"
                :disabled="isRegistering || isDeadlinePassed"
              >
                <span v-if="isRegistering">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  {{ $t("Registering") }}...
                </span>
                <span v-else-if="isDeadlinePassed">
                  <i class="fa fa-clock-o me-2"></i>
                  {{ $t("Registration Closed") }}
                </span>
                <span v-else>
                  <i class="fa fa-check-circle me-2"></i>
                  {{ $t("Register Now") }}
                </span>
              </button>
              <button @click="downloadPoster" class="btn btn-light border px-4">
                <i class="fa fa-download me-2"></i> {{ $t("Download Poster") }}
              </button>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-sidebar mt-4">
            <AgendaDetailPageSidebar />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import Swal from "sweetalert2";
import SkeletonGroup from "@/components/base/default/SkeletonLoader/SkeletonGroup.vue";
import AgendaDetailPageSidebar from "@/components/base/default/agendaDetailPageSidebar.vue";
import { formatDate } from "@/utils/formatDate";
import { getDetailEvent, getEvents } from "@/services/public/eventsPublic";
import {
  addEventUser,
  getEventUsers,
  deleteEventUser,
} from "@/services/general/eventUsers/eventUsers";
import { getStatuses } from "@/services/referensi/status";

const route = useRoute();
const { t, locale } = useI18n();

import {
  STATUS_TERDAFTAR_ID,
  getAgendaStatusIcon,
  getAgendaStatusSemantic,
  getAgendaCancelReasonKey,
} from "@/constants/agendaStatus";

// State
const data = ref(null);
const isLoading = ref(false);
const isRegistering = ref(false);
const isCancelling = ref(false);
const isRegistered = ref(false);
const registrationId = ref(null);
const registrationStatusId = ref(null);
const registrationStatus = ref("Terdaftar");
const error = ref(null);
const statusOptions = ref([]);

const defaultPosterUrl =
  "https://placehold.co/800x400/EBF4FF/7F9CF5?text=Agenda";

const isDeadlinePassed = computed(() => {
  if (!data.value?.registration_deadline) return false;

  const deadline = new Date(data.value.registration_deadline);
  const today = new Date();
  deadline.setHours(23, 59, 59, 999);

  return today > deadline;
});

const canCancel = computed(() => {
  return registrationStatusId.value === STATUS_TERDAFTAR_ID;
});

const fetchDetail = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const param = route.params.id;
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        param
      );

    let item;

    if (isUUID) {
      const response = await getDetailEvent(param);
      item = response.data?.[0]?.data?.[0];
    } else {
      const response = await getEvents({ filter: `slug=${param}` });
      const list = response.data?.[0]?.data || response.data?.data || [];
      item = list.length > 0 ? list[0] : null;
    }

    if (!item) {
      error.value = "Agenda tidak ditemukan.";
      return;
    }

    const title = item.judul || item.judul_en || "Detail Agenda";
    document.title = `${title} - Direktorat Bina Peningkatan Produktivitas Nasional`;

    data.value = {
      id: item.id_agenda,
      image: item.poster || defaultPosterUrl,
      kategori:
        item.kategori_agenda?.nama_kategori_agenda ||
        item["event-categories"]?.namakategoriagenda ||
        "",
      kategori_en:
        item.kategori_agenda?.nama_kategori_agenda_en ||
        item["event-categories"]?.namakategoriagenda_en ||
        "",
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

  await checkRegistration();
};

const checkRegistration = async () => {
  const userDataString = localStorage.getItem("userData");
  if (!userDataString) return;

  const userData = JSON.parse(userDataString);
  const userId =
    userData?.data?.[0]?.id_pengguna || userData?.data?.[0]?.idpengguna;

  if (!userId || !data.value?.id) return;

  try {
    const response = await getEventUsers({
      filter: `id_pengguna=${userId},id_agenda=${data.value.id}`,
    });

    const registrations = response.data?.[0]?.data || [];

    if (registrations.length > 0) {
      isRegistered.value = true;
      registrationId.value = registrations[0].id_agenda_pengguna;
      registrationStatusId.value = registrations[0].id_status;

      const statusData =
        registrations[0].status_agenda_pengguna ||
        registrations[0]["event-user-statuses"] ||
        registrations[0].statuses;

      let statusName = statusData?.nama_status || statusData?.namastatus;

      if (
        !statusName &&
        registrationStatusId.value &&
        statusOptions.value.length > 0
      ) {
        const foundStatus = statusOptions.value.find(
          (s) =>
            s.idstatus === registrationStatusId.value ||
            s.id_status === registrationStatusId.value
        );
        statusName = foundStatus?.namastatus || foundStatus?.nama_status;
      }

      registrationStatus.value = statusName || "Terdaftar";
    } else {
      isRegistered.value = false;
      registrationId.value = null;
      registrationStatusId.value = null;
    }
  } catch (err) {
    console.error("Error checking registration:", err);
    isRegistered.value = false;
  }
};

const fetchStatusOptions = async () => {
  try {
    const res = await getStatuses({ limit: 100 });
    const responseData = Array.isArray(res.data) ? res.data[0] : res.data;
    statusOptions.value = responseData?.data || [];
  } catch (err) {
    console.error("Error fetching status options:", err);
  }
};

const handleImageError = (event) => {
  event.target.src = defaultPosterUrl;
};

// Get reason why cancel is disabled
// Get reason why cancel is disabled
const getCancelDisabledReason = () => {
  const key = getAgendaCancelReasonKey(registrationStatusId.value);
  return t(key);
};

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

  window.open(imageUrl, "_blank");
};

const registerAgenda = async () => {
  const userDataString = localStorage.getItem("userData");
  if (!userDataString) {
    Swal.fire({
      icon: "warning",
      title: t("Not Logged In"),
      text: t("Please login first to register for this event"),
      confirmButtonColor: "#7366ff",
    });
    return;
  }

  const userData = JSON.parse(userDataString);
  const userId =
    userData?.data?.[0]?.id_pengguna || userData?.data?.[0]?.idpengguna;

  if (!userId) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: t("User data not found. Please login again"),
      confirmButtonColor: "#7366ff",
    });
    return;
  }

  if (!data.value?.id) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: t("Event data not found"),
      confirmButtonColor: "#7366ff",
    });
    return;
  }

  const eventTitle =
    locale.value === "en"
      ? data.value.title_en || data.value.title
      : data.value.title;

  const result = await Swal.fire({
    icon: "question",
    title: t("Registration Confirmation"),
    html: `${t(
      "Are you sure you want to register for event"
    )}:<br><br><strong>${eventTitle}</strong>?`,
    showCancelButton: true,
    confirmButtonText: t("Yes Register"),
    cancelButtonText: t("Cancel"),
    confirmButtonColor: "#7366ff",
    cancelButtonColor: "#efefef",
  });

  if (!result.isConfirmed) return;

  isRegistering.value = true;

  try {
    const formData = new FormData();
    formData.append("record[id_agenda]", data.value.id);
    formData.append("record[id_pengguna]", userId);
    formData.append("record[id_status]", STATUS_TERDAFTAR_ID);

    await addEventUser(formData);

    await checkRegistration();

    Swal.fire({
      icon: "success",
      title: t("Success") + "!",
      text: t("You have successfully registered for this event"),
      confirmButtonColor: "#7366ff",
    });
  } catch (err) {
    console.error("Registration error:", err);

    const errorMessage =
      err.response?.data?.message || t("Failed to register. Please try again");

    Swal.fire({
      icon: "error",
      title: t("Registration Failed"),
      text: errorMessage,
      confirmButtonColor: "#7366ff",
    });
  } finally {
    isRegistering.value = false;
  }
};

const cancelRegistration = async () => {
  if (!registrationId.value) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: t("Registration data not found"),
      confirmButtonColor: "#7366ff",
    });
    return;
  }

  const eventTitle =
    locale.value === "en"
      ? data.value.title_en || data.value.title
      : data.value.title;

  const result = await Swal.fire({
    icon: "warning",
    title: t("Cancel Registration"),
    html: `${t(
      "Are you sure you want to cancel registration for event"
    )}:<br><br><strong>${eventTitle}</strong>?`,
    showCancelButton: true,
    confirmButtonText: t("Yes Cancel"),
    cancelButtonText: t("No"),
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#efefef",
  });

  if (!result.isConfirmed) return;

  isCancelling.value = true;

  try {
    await deleteEventUser(registrationId.value);

    isRegistered.value = false;
    registrationId.value = null;
    registrationStatus.value = t("Registered");

    Swal.fire({
      icon: "success",
      title: t("Success") + "!",
      text: t("Your registration has been cancelled"),
      confirmButtonColor: "#7366ff",
    });
  } catch (err) {
    console.error("Cancel registration error:", err);

    const errorMessage =
      err.response?.data?.message ||
      t("Failed to cancel registration. Please try again");

    Swal.fire({
      icon: "error",
      title: t("Cancellation Failed"),
      text: errorMessage,
      confirmButtonColor: "#7366ff",
    });
  } finally {
    isCancelling.value = false;
  }
};

const getStatusClass = (statusId) => {
  const semantic = getAgendaStatusSemantic(statusId);
  switch (semantic) {
    case "completed":
      return "status-completed";
    case "rejected":
      return "status-cancelled";
    case "accepted":
      return "status-accepted";
    case "registered":
    default:
      return "status-registered";
  }
};

const getCardClass = (statusId) => {
  const semantic = getAgendaStatusSemantic(statusId);
  switch (semantic) {
    case "completed":
      return "card-completed";
    case "rejected":
      return "card-cancelled";
    case "accepted":
      return "card-accepted";
    case "registered":
    default:
      return "card-registered";
  }
};

const getStatusMessage = (statusId) => {
  const semantic = getAgendaStatusSemantic(statusId);
  switch (semantic) {
    case "completed":
      return t("Status Message Completed");
    case "rejected":
      return t("Status Message Rejected");
    case "accepted":
      return t("Status Message Accepted");
    case "registered":
    default:
      return t("Status Message Registered");
  }
};

const getStatusIcon = (statusId) => {
  return getAgendaStatusIcon(statusId);
};

// Lifecycle
onMounted(async () => {
  await fetchStatusOptions();
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

.alert-info {
  background-color: rgba(13, 202, 240, 0.1);
  border-color: rgba(13, 202, 240, 0.3);
  color: #055160;
}

.registration-status-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 12px;
  border-left: 4px solid;
}

.registration-status-card.card-registered {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-left-color: #2196f3;
}

.registration-status-card.card-registered .status-icon {
  background: #2196f3;
}

.registration-status-card.card-registered .status-label,
.registration-status-card.card-registered .status-message {
  color: #1565c0;
}

.registration-status-card.card-accepted {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-left-color: #4caf50;
}

.registration-status-card.card-accepted .status-icon {
  background: #4caf50;
}

.registration-status-card.card-accepted .status-label,
.registration-status-card.card-accepted .status-message {
  color: #2e7d32;
}

.registration-status-card.card-completed {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  border-left-color: #8e24aa;
}

.registration-status-card.card-completed .status-icon {
  background: #8e24aa;
}

.registration-status-card.card-completed .status-label,
.registration-status-card.card-completed .status-message {
  color: #6a1b9a;
}

.registration-status-card.card-cancelled {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border-left-color: #f44336;
}

.registration-status-card.card-cancelled .status-icon {
  background: #f44336;
}

.registration-status-card.card-cancelled .status-label,
.registration-status-card.card-cancelled .status-message {
  color: #c62828;
}

.status-icon {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  font-size: 24px;
}

.status-content {
  flex: 1;
}

.status-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.status-label {
  font-weight: 600;
  color: #2e7d32;
  font-size: 1rem;
}

.status-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.status-registered {
  background-color: #2196f3;
  color: white;
}

.status-badge.status-completed {
  background-color: #8e24aa;
  color: white;
}

.status-badge.status-pending {
  background-color: #ff9800;
  color: white;
}

.status-badge.status-accepted {
  background-color: #4caf50;
  color: white;
}

.status-badge.status-cancelled {
  background-color: #f44336;
  color: white;
}

.status-message {
  margin: 0 0 0.75rem 0;
  color: #1b5e20;
  font-size: 0.95rem;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #2e7d32;
}

.info-item i {
  width: 18px;
  text-align: center;
  color: #4caf50;
}

.detail-layout {
  display: flex;
  flex-wrap: wrap;
}

.col-main {
  width: 100%;
  padding-right: calc(var(--bs-gutter-x) * 0.5);
  padding-left: calc(var(--bs-gutter-x) * 0.5);
}

.col-sidebar {
  width: 100%;
  padding-right: calc(var(--bs-gutter-x) * 0.5);
  padding-left: calc(var(--bs-gutter-x) * 0.5);
}

@media (min-width: 1350px) {
  .col-main {
    flex: 0 0 auto;
    width: 66.666667%;
  }

  .col-sidebar {
    flex: 0 0 auto;
    width: 33.333333%;
    margin-top: 0 !important;
    position: sticky;
    top: 100px;
    align-self: flex-start;
  }
}
</style>
