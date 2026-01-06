<template>
  <div class="col-lg-4 sticky-column">
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
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import VueEasyLightbox from "vue-easy-lightbox";
import { getInitials, getRandomColor } from "@/utils/avatarUtils";

const { t } = useI18n();

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
const lightboxVisible = ref(false);

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
    top: 100px;
    z-index: 5;
    height: fit-content;
    align-self: flex-start;
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
</style>
