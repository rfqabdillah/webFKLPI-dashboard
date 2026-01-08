<template>
  <div
    class="card agenda-card h-100 shadow-sm border-0"
    :class="{ 'cursor-pointer': !path }"
    @click="!path && $emit('click')"
  >
    <!-- Image Section -->
    <component
      :is="path ? 'router-link' : 'div'"
      :to="path"
      class="card-img-wrapper position-relative overflow-hidden d-block"
      @click="!path && $emit('click')"
    >
      <img
        :src="props.item.image"
        :alt="props.item.title"
        class="card-img-top agenda-image"
        @error="handleImageError"
      />
      <!-- Category Badge -->
      <div class="position-absolute top-0 start-0 m-2">
        <span
          class="badge rounded-pill px-3 py-2"
          style="background-color: #15406a"
        >
          {{ props.item.tag1 }}
        </span>
      </div>
    </component>

    <!-- Card Body -->
    <div class="card-body d-flex flex-column">
      <!-- Date & Participants Info -->
      <div class="d-flex flex-wrap gap-3 mb-3 text-muted agenda-info">
        <span class="d-flex align-items-center">
          <i class="fa fa-calendar me-1"></i>
          {{
            formatDate(
              props.item.registration_deadline,
              props.item.locale || "id"
            )
          }}
        </span>
        <span class="d-flex align-items-center">
          <i class="fa fa-users me-1"></i>
          {{ props.item.students }} {{ $t("Participants") }}
        </span>
      </div>

      <!-- Title -->
      <h5 class="card-title fw-semibold text-dark mb-0 agenda-title">
        <router-link
          v-if="path"
          :to="path"
          class="text-dark text-decoration-none stretched-link-custom"
        >
          {{ props.item.title }}
        </router-link>
        <span v-else>{{ props.item.title }}</span>
      </h5>

      <!-- Implementation Date & Location -->
      <div class="agenda-info text-muted mb-3 mt-2">
        <div class="d-flex align-items-start mb-1">
          <i class="fa fa-clock-o me-2 mt-1"></i>
          <span
            >{{ $t("Implementation") }}:
            {{
              formatDate(
                props.item.implementation_date,
                props.item.locale || "id"
              )
            }}</span
          >
        </div>
        <div class="d-flex align-items-start">
          <i class="fa fa-map-marker me-2 mt-1"></i>
          <span>{{ props.item.place }}</span>
        </div>
      </div>

      <!-- Status Bar (optional) - Full width bar below location -->
      <div
        v-if="showStatus && props.item.statusId"
        class="status-bar mb-3"
        :class="getStatusBarClass()"
      >
        <i :class="getStatusIcon()" class="me-2"></i>
        <span class="status-label">{{ $t("Your Status") }}:</span>
        <span class="status-text">{{ getStatusLabel() }}</span>
      </div>

      <!-- Footer -->
      <div
        class="d-flex align-items-center pt-3 border-top mt-auto justify-content-between"
      >
        <!-- Cancel Button (optional) - LEFT side -->
        <div>
          <button
            v-if="showCancelButton && props.item.statusId"
            class="btn btn-sm"
            :class="canCancel ? 'btn-outline-danger' : 'btn-outline-secondary'"
            @click.stop="handleCancelClick"
            :disabled="!canCancel || isCancelling"
            :title="!canCancel ? getCancelDisabledReason() : ''"
            style="position: relative; z-index: 2"
          >
            <span v-if="isCancelling">
              <span class="spinner-border spinner-border-sm me-1"></span>
              {{ $t("Cancelling") }}...
            </span>
            <span v-else>
              <i class="fa fa-times-circle me-1"></i>
              {{ $t("Batalkan") }}
            </span>
          </button>
        </div>

        <!-- Read More Button - RIGHT side -->
        <component
          :is="path ? 'router-link' : 'span'"
          :to="path"
          class="btn-selengkapnya text-decoration-none"
          :class="{ 'cursor-pointer': !path }"
          @click="!path && $emit('click')"
        >
          {{ $t("Read More") }} <i class="fa fa-arrow-right ms-1"></i>
        </component>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { formatDate } from "@/utils/formatDate";

const { t, locale } = useI18n();

// Status constants
import {
  STATUS_TERDAFTAR_ID,
  STATUS_DITOLAK_ID,
  STATUS_DITERIMA_ID,
  STATUS_SELESAI_ID,
} from "@/constants/agendaStatus";

// Emit events
const emit = defineEmits(["click", "cancel"]);

// Props from parent component
const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({
      id: "",
      image: "",
      tag1: "",
      registration_deadline: "",
      implementation_date: "",
      place: "",
      title: "",
      desc: "",
      photo: "",
      author: "",
      students: 0,
      locale: "id",
      // Optional status fields
      registrationId: null,
      statusId: null,
      statusName: "",
      statusNameEn: "",
    }),
  },
  // New prop for navigation path
  path: {
    type: String,
    default: "",
  },
  showStatus: {
    type: Boolean,
    default: false,
  },
  showCancelButton: {
    type: Boolean,
    default: false,
  },
  isCancelling: {
    type: Boolean,
    default: false,
  },
});

// Default fallback image
const defaultPosterUrl =
  "https://placehold.co/400x250/EBF4FF/7F9CF5?text=Agenda";

// Computed: Can cancel registration (only if Terdaftar/Registered)
const canCancel = computed(() => {
  const statusId = props.item.statusId;
  return statusId === STATUS_TERDAFTAR_ID;
});

// Get status label based on locale
const getStatusLabel = () => {
  if (locale.value === "en" && props.item.statusNameEn) {
    return props.item.statusNameEn;
  }
  return props.item.statusName || t("Registered");
};

// Get status icon based on status
const getStatusIcon = () => {
  const statusId = props.item.statusId;
  switch (statusId) {
    case STATUS_SELESAI_ID:
      return "fa fa-check-circle"; // Completed
    case STATUS_DITOLAK_ID:
      return "fa fa-times-circle"; // Rejected
    case STATUS_DITERIMA_ID:
      return "fa fa-check"; // Accepted
    case STATUS_TERDAFTAR_ID:
    default:
      return "fa fa-clock-o"; // Registered/Pending
  }
};

// Get status bar class based on status
const getStatusBarClass = () => {
  const statusId = props.item.statusId;
  switch (statusId) {
    case STATUS_SELESAI_ID:
      return "status-bar-purple"; // Completed - Purple
    case STATUS_DITOLAK_ID:
      return "status-bar-danger"; // Rejected - Red
    case STATUS_DITERIMA_ID:
      return "status-bar-success"; // Accepted - Green
    case STATUS_TERDAFTAR_ID:
    default:
      return "status-bar-info"; // Registered - Blue
  }
};

// Handle image loading error
const handleImageError = (event) => {
  event.target.src = defaultPosterUrl;
};

// Get reason why cancel is disabled
const getCancelDisabledReason = () => {
  const statusId = props.item.statusId;
  switch (statusId) {
    case STATUS_SELESAI_ID:
      return t("Cannot cancel - Event completed");
    case STATUS_DITOLAK_ID:
      return t("Cannot cancel - Registration rejected");
    case STATUS_DITERIMA_ID:
      return t("Cannot cancel - Already accepted");
    default:
      return t("Cannot cancel registration");
  }
};

// Handle cancel click
const handleCancelClick = () => {
  if (!canCancel.value) return;
  emit("cancel", {
    registrationId: props.item.registrationId,
    agendaId: props.item.id,
    title: props.item.title,
  });
};
</script>

<style scoped>
.agenda-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.agenda-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(115, 102, 255, 0.15) !important;
}

.card-img-wrapper {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
}

.agenda-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.agenda-card:hover .agenda-image {
  transform: scale(1.05);
}

.agenda-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  min-height: 0;
}

.agenda-info {
  font-size: 14px;
}

.btn-selengkapnya {
  background-color: rgba(21, 64, 106, 0.1);
  color: #15406a;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-selengkapnya:hover {
  background-color: #15406a;
  color: white;
}

/* Cancel Button Style */
.btn-outline-danger.btn-sm {
  font-size: 13px;
}

/* Status Bar Styles */
.status-bar {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
}

.status-bar i {
  font-size: 16px;
}

.status-bar .status-text {
  font-weight: 600;
}

.status-bar .status-label {
  margin-right: 4px;
  font-weight: 400;
}

.status-bar-info {
  background-color: rgba(23, 162, 184, 0.12);
  color: #117a8b;
  border-left: 4px solid #17a2b8;
}

.status-bar-success {
  background-color: rgba(40, 167, 69, 0.12);
  color: #1e7e34;
  border-left: 4px solid #28a745;
}

.status-bar-danger {
  background-color: rgba(220, 53, 69, 0.12);
  color: #bd2130;
  border-left: 4px solid #dc3545;
}

.status-bar-purple {
  background-color: rgba(111, 66, 193, 0.12);
  color: #5a32a3;
  border-left: 4px solid #6f42c1;
}

.cursor-pointer {
  cursor: pointer;
}

/* Custom Stretched Link to make the whole card clickable via the Title link */
/* We use a custom class to avoid potential conflicts if standard bootstrap is not behaving as expected */
.stretched-link-custom::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  content: "";
}

/* Ensure relative positioning for containment */
.agenda-card {
  position: relative;
}
</style>
