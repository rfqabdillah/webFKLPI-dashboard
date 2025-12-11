<template>
  <div
    class="card agenda-card h-100 shadow-sm border-0"
    @click="$emit('click')"
    style="cursor: pointer"
  >
    <!-- Image Section -->
    <div class="card-img-wrapper position-relative overflow-hidden">
      <img
        :src="props.item.image"
        :alt="props.item.title"
        class="card-img-top agenda-image"
        @error="handleImageError"
      />
      <!-- Category Badge -->
      <div class="position-absolute top-0 start-0 m-2">
        <span class="badge bg-primary rounded-pill px-3 py-2">
          {{ props.item.tag1 }}
        </span>
      </div>
    </div>

    <!-- Card Body -->
    <div class="card-body d-flex flex-column">
      <!-- Date & Participants Info -->
      <div class="d-flex flex-wrap gap-3 mb-3 text-muted agenda-info">
        <span class="d-flex align-items-center">
          <i class="fa fa-calendar me-1"></i>
          {{ formatTanggal(props.item.registration_deadline) }}
        </span>
        <span class="d-flex align-items-center">
          <i class="fa fa-users me-1"></i>
          {{ props.item.students }} Peserta
        </span>
      </div>

      <!-- Title -->
      <h5 class="card-title fw-semibold text-dark mb-0 agenda-title">
        {{ props.item.title }}
      </h5>

      <!-- Implementation Date & Location -->
      <div class="agenda-info text-muted mb-3">
        <div class="d-flex align-items-start mb-1">
          <i class="fa fa-clock-o me-2 mt-1"></i>
          <span
            >Pelaksanaan:
            {{ formatTanggal(props.item.implementation_date) }}</span
          >
        </div>
        <div class="d-flex align-items-start">
          <i class="fa fa-map-marker me-2 mt-1"></i>
          <span>{{ props.item.place }}</span>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="d-flex justify-content-between align-items-center pt-3 border-top"
      >
        <div class="d-flex align-items-center">
          <div class="author-avatar me-2">
            <i class="fa fa-user"></i>
          </div>
          <span class="author-name">{{ props.item.author }}</span>
        </div>
        <span class="btn-selengkapnya">
          Selengkapnya <i class="fa fa-arrow-right ms-1"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";

// Emit event when card is clicked
defineEmits(["click"]);

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
    }),
  },
});

// Default fallback images
const defaultPosterUrl =
  "https://placehold.co/400x250/EBF4FF/7F9CF5?text=Agenda";
const defaultAvatarUrl = "https://placehold.co/40x40/E0E7FF/6366F1?text=User";

// Helper function to format date
const formatTanggal = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Handle image loading error
const handleImageError = (event) => {
  event.target.src = defaultPosterUrl;
};

const handleAvatarError = (event) => {
  event.target.src = defaultAvatarUrl;
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
  height: 180px;
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
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  min-height: 0;
}

.agenda-info {
  font-size: 14px;
}

.agenda-desc {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  font-size: 14px;
}

.badge.bg-primary {
  background-color: #7366ff !important;
  font-weight: 500;
  font-size: 0.75rem;
}

.author-avatar {
  width: 36px;
  height: 36px;
  background-color: #e8e6f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.author-avatar i {
  color: #6c757d;
  font-size: 16px;
}

.author-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.btn-selengkapnya {
  background-color: rgba(115, 102, 255, 0.1);
  color: #7366ff;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-selengkapnya:hover {
  background-color: #7366ff;
  color: white;
}
</style>
