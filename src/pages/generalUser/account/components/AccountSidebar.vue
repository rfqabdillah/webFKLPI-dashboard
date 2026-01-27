<template>
  <div class="col-lg-4 sticky-column" ref="sidebarRef" :style="stickyStyle">
    <div class="card profile-sidebar shadow-sm">
      <!-- Banner -->
      <div class="sidebar-banner"></div>

      <div class="card-body text-center pt-0">
        <!-- Profile Photo -->
        <div class="profile-img-wrapper">
          <div
            v-if="!user.foto"
            class="profile-img rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow"
            :style="{ backgroundColor: getRandomColor(user.nama) }"
          >
            <span class="display-4">{{ getInitials(user.nama) }}</span>
          </div>
          <img
            v-else
            :src="user.foto"
            alt="Profile"
            class="profile-img rounded-circle shadow clickable-photo"
            @error="handleImageError"
            @click="openLightbox"
          />

          <!-- Photo Upload Button -->
          <button
            class="photo-upload-btn"
            @click="triggerPhotoUpload"
            :disabled="isUploadingPhoto"
            :title="$t('Change Photo')"
          >
            <i v-if="isUploadingPhoto" class="fa fa-spinner fa-spin"></i>
            <i v-else class="fa fa-camera"></i>
          </button>

          <!-- Hidden File Input -->
          <input
            ref="photoInputRef"
            type="file"
            accept="image/*"
            class="d-none"
            @change="handlePhotoUpload"
          />
        </div>
        <!-- Lightbox for Photo Preview -->
        <Teleport to="body">
          <VueEasyLightbox
            :visible="lightboxVisible"
            :imgs="lightboxImages"
            :index="0"
            @hide="lightboxVisible = false"
          />
        </Teleport>

        <!-- Name & Role -->
        <h4 class="mt-3 mb-1 fw-bold">{{ fullName }}</h4>
        <p class="text-muted mb-2">
          <i class="fa fa-id-badge me-1"></i>{{ userRole }}
        </p>
        <span
          class="badge px-3 py-2"
          :class="user.status === 'Aktif' ? 'bg-success' : 'bg-secondary'"
        >
          {{ user.status || "Aktif" }}
        </span>

        <hr class="my-4" />

        <!-- Quick Contact Info -->
        <div class="quick-info">
          <div class="quick-info-item">
            <div class="quick-icon bg-primary-soft">
              <i class="fa fa-envelope text-primary"></i>
            </div>
            <div class="quick-text">
              <small class="text-muted">Email</small>
              <span>{{ user.email || "-" }}</span>
            </div>
          </div>

          <div class="quick-info-item">
            <div class="quick-icon bg-success-soft">
              <i class="fa fa-phone text-success"></i>
            </div>
            <div class="quick-text">
              <small class="text-muted">{{ $t("Phone") }}</small>
              <span>{{ user.telp || "-" }}</span>
            </div>
          </div>

          <div class="quick-info-item">
            <div class="quick-icon bg-info-soft">
              <i class="fa fa-map-marker text-info"></i>
            </div>
            <div class="quick-text">
              <small class="text-muted">{{ $t("Address") }}</small>
              <span>{{ user.alamat || "-" }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Events Card -->
    <div class="card mt-3 shadow-sm border-0">
      <div class="card-header bg-white">
        <div class="d-flex align-items-center">
          <div class="section-icon bg-primary">
            <i class="fa fa-calendar-check-o text-white"></i>
          </div>
          <h5 class="mb-0 ms-3">{{ $t("Upcoming Events") }}</h5>
        </div>
      </div>
      <div class="card-body">
        <div v-if="isLoadingAgendas" class="py-2">
          <SkeletonGroup type="sidebar-agenda" :count="3" />
        </div>

        <div v-else-if="upcomingAgendas.length === 0" class="text-center py-3">
          <p class="text-muted small mb-0">{{ $t("No upcoming events") }}</p>
        </div>

        <div v-else class="agenda-list">
          <div
            v-for="item in upcomingAgendas"
            :key="item.id"
            class="agenda-item p-3 mb-3 rounded shadow-sm border-start border-4 bg-light d-flex align-items-center justify-content-between"
            :class="
              item.daysRemaining <= 3 ? 'border-danger' : 'border-success'
            "
          >
            <div
              class="text-center rounded p-2 flex-shrink-0 me-3"
              :class="
                item.daysRemaining <= 3
                  ? 'bg-danger text-white'
                  : 'bg-white border border-success text-success'
              "
              style="min-width: 60px"
            >
              <div class="h4 fw-bold mb-0" style="line-height: 1">
                {{ item.daysRemaining }}
              </div>
              <div style="font-size: 10px" class="fw-bold text-uppercase mt-1">
                {{ $t("days left") }}
              </div>
            </div>

            <div class="overflow-hidden flex-grow-1">
              <h6
                class="fw-bold text-dark mb-1 text-truncate"
                :title="item.title"
              >
                {{ item.title }}
              </h6>
              <div class="text-muted small">
                <div class="mb-1 d-flex align-items-center">
                  <i class="fa fa-calendar me-2"></i>
                  {{ formatShortDate(item.date, $i18n.locale) }}
                </div>
                <div class="d-flex align-items-center text-truncate">
                  <i class="fa fa-map-marker me-2"></i>
                  <span class="text-truncate">{{ item.place }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer bg-transparent border-0 pt-0 text-center">
        <router-link
          to="/my-events"
          class="btn btn-link btn-sm text-decoration-none"
        >
          {{ $t("View More") }} <i class="fa fa-arrow-right ms-1"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import VueEasyLightbox from "vue-easy-lightbox";
import { getInitials, getRandomColor } from "@/utils/avatarUtils";
import { getEventUsers } from "@/services/general/eventUsers/eventUsers";
import { formatShortDate } from "@/utils/formatDate";
import { STATUS_DITERIMA_ID } from "@/constants/agendaStatus";
import { SkeletonGroup } from "@/components/base/default/SkeletonLoader";

const { t, locale } = useI18n();

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  isUploadingPhoto: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["upload-photo", "image-error"]);

const photoInputRef = ref(null);
const sidebarRef = ref(null);
const stickyStyle = ref({ position: "sticky", top: "100px" });
const lightboxVisible = ref(false);
const userAgendas = ref([]);
const isLoadingAgendas = ref(false);

const lightboxImages = computed(() => {
  return props.user.foto ? [props.user.foto] : [];
});

const fullName = computed(() => {
  const parts = [props.user.gelardepan, props.user.nama].filter(Boolean);
  let name = parts.join(" ");
  if (props.user.gelarbelakang) {
    name += `, ${props.user.gelarbelakang}`;
  }
  return name || t("User");
});

const userRole = computed(() => {
  return props.user.roles?.[0]?.namalevel || props.user.nama_level || t("User");
});

const upcomingAgendas = computed(() => {
  if (!userAgendas.value.length) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const processed = userAgendas.value
    .map((item) => {
      // Filter by status 'Diterima' strict check
      if (item.id_status !== STATUS_DITERIMA_ID) return null;

      const agenda = item.events || item.agenda; // Handle both structures

      if (!agenda) return null;

      const dateStr = agenda.tanggal_pelaksanaan;
      if (!dateStr) return null; // Skip if no date

      const eventDate = new Date(dateStr);
      if (isNaN(eventDate.getTime())) return null;

      const diffTime = eventDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const title =
        locale.value === "en"
          ? agenda.judul_en || agenda.judul || "Untitled"
          : agenda.judul || "Tanpa Judul";

      return {
        id: agenda.id_agenda,
        title: title,
        date: agenda.tanggal_pelaksanaan,
        place: agenda.tempat_pelaksanaan || "-",
        daysRemaining: diffDays,
      };
    })
    .filter((item) => {
      // Filter out invalid items
      if (!item) return false;
      // Filter only future or today
      if (item.daysRemaining < 0) return false;

      // Strict client-side status check if API returns mixed statuses
      // Item status is usually at the root of the userAgenda object passing through mapping
      // But here we mapped it to a new object. We need to check the original source.
      // Wait, 'map' runs before 'filter'. We need to check status inside map or change order.
      // Let's filter on the source array first or checking in map.
      return true;
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining) // Sort by nearest
    .slice(0, 5); // Take top 5

  return processed;
});

// Methods
const handleImageError = () => {
  emit("image-error");
};

const openLightbox = () => {
  if (props.user.foto) {
    lightboxVisible.value = true;
  }
};

const triggerPhotoUpload = () => {
  if (photoInputRef.value) {
    photoInputRef.value.click();
  }
};

const handlePhotoUpload = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  emit("upload-photo", file);
  if (photoInputRef.value) {
    photoInputRef.value.value = "";
  }
};

const fetchUserAgendas = async (userId) => {
  if (!userId) return;
  isLoadingAgendas.value = true;
  try {
    const response = await getEventUsers({
      filter: `id_pengguna=${userId}`, // Removed server-side status filter
      with: "agenda,status",
    });

    let data = [];
    const rawData = response.data || response; // Handle if response is already the body/array

    if (Array.isArray(rawData)) {
      if (rawData.length > 0 && rawData[0].data) {
        // Handle [{ data: [...], meta: ... }]
        data = rawData[0].data;
      } else {
        // Handle direct array [...items]
        data = rawData;
      }
    } else if (rawData && rawData.data) {
      // Handle standard { data: [...] }
      data = rawData.data;
    } else {
      // Handle array in data property but maybe different structure
      data = rawData || [];
    }

    userAgendas.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching user agendas:", error);
  } finally {
    isLoadingAgendas.value = false;
  }
};

watch(
  () => props.user,
  (newUser) => {
    if (newUser && (newUser.id || newUser.id_pengguna || newUser.idpengguna)) {
      fetchUserAgendas(newUser.id || newUser.id_pengguna || newUser.idpengguna);
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (
    props.user &&
    (props.user.id || props.user.id_pengguna || props.user.idpengguna)
  ) {
    fetchUserAgendas(
      props.user.id || props.user.id_pengguna || props.user.idpengguna,
    );
  }

  updateStickyBehavior();
  window.addEventListener("resize", updateStickyBehavior);
});

// onUnmounted(() => {
//   window.removeEventListener("resize", updateStickyBehavior);
// });

watch(userAgendas, () => {
  // Wait for DOM update
  setTimeout(updateStickyBehavior, 500);
});

const updateStickyBehavior = () => {
  if (!sidebarRef.value) return;

  const sidebarHeight = sidebarRef.value.offsetHeight;
  const windowHeight = window.innerHeight;
  const topOffset = 100; // default top offset
  const bottomOffset = 20; // desired bottom offset

  // Check if sidebar fits in viewport (with top offset)
  if (sidebarHeight + topOffset < windowHeight) {
    // Fits: Stick to Top
    stickyStyle.value = {
      position: "sticky",
      top: `${topOffset}px`,
      alignSelf: "flex-start",
    };
  } else {
    // Too tall: Stick to Bottom (allows natural scroll first)
    stickyStyle.value = {
      position: "sticky",
      bottom: `${bottomOffset}px`,
      alignSelf: "flex-end", // Helps in flex container context sometimes
    };
  }
};
</script>

<style scoped>
.profile-sidebar {
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

.sidebar-banner {
  height: 100px;
  background-color: #05e8ba;
  background-image: linear-gradient(315deg, #05e8ba 0%, #087ee1 74%);
}

.card-body {
  padding: 20px;
}

.profile-img-wrapper {
  margin-top: -60px;
  position: relative;
  display: inline-block;
}

.profile-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: white;
}

.photo-upload-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
  border: 3px solid white;
  color: white;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(13, 110, 253, 0.4);
}

.photo-upload-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.5);
}

.photo-upload-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.clickable-photo {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.clickable-photo:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.quick-info {
  text-align: left;
}

.quick-info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.quick-info-item:last-child {
  border-bottom: none;
}

.quick-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bg-primary-soft {
  background-color: rgba(13, 110, 253, 0.1);
}

.bg-success-soft {
  background-color: rgba(40, 167, 69, 0.1);
}

.bg-info-soft {
  background-color: rgba(23, 162, 184, 0.1);
}

.quick-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.quick-text small {
  font-size: 12px;
  margin-bottom: 2px;
}

.quick-text span {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  word-break: break-word;
}

/* Sticky Sidebar CSS */
@media (min-width: 992px) {
  .sticky-column {
    position: -webkit-sticky;
    position: sticky;
    z-index: 5;
    height: fit-content;
    /* top/bottom and align-self are handled via JS style binding now */
  }
}

@media (max-width: 991px) {
  .profile-sidebar {
    margin-bottom: 20px;
  }

  .sidebar-banner {
    height: 80px;
  }

  .profile-img-wrapper {
    margin-top: -50px;
  }

  .profile-img {
    width: 100px;
    height: 100px;
  }
}

.section-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}
</style>
