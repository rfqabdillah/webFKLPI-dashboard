<template>
  <div class="card shadow-sm border-0 sticky-sidebar">
    <div class="card-body">
      <!-- Search -->
      <div class="mb-4">
        <label class="form-label fw-semibold">Cari Agenda</label>
        <div class="input-group">
          <span class="input-group-text bg-light border-end-0">
            <i class="fa fa-search text-muted"></i>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control border-start-0 ps-0"
            placeholder="Cari agenda..."
          />
        </div>
      </div>

      <!-- Recent Posts -->
      <div class="mb-4">
        <h6 class="fw-semibold mb-3">Agenda Terbaru</h6>

        <div v-if="isLoading" class="text-center py-3">
          <div
            class="spinner-border spinner-border-sm text-primary"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else-if="eventsRecentPost.length === 0" class="text-muted small">
          Tidak ada agenda terbaru.
        </div>

        <div v-else>
          <div
            v-for="(item, index) in eventsRecentPost"
            :key="index"
            class="d-flex align-items-center mb-3"
          >
            <img
              :src="item.image"
              :alt="item.title"
              class="rounded"
              style="width: 60px; height: 60px; object-fit: cover"
              @error="handleImageError($event)"
            />
            <div class="ms-3">
              <router-link
                :to="`/agenda-detail/${item.id}`"
                class="fw-medium text-dark text-decoration-none hover-primary d-block"
                style="font-size: 14px"
              >
                {{ truncateText(item.title, 40) }}
              </router-link>
              <small class="text-muted">{{ formatDate(item.date) }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Social Links -->
      <div>
        <h6 class="fw-semibold mb-3">Sosial Media</h6>
        <div class="d-flex flex-wrap gap-2">
          <a
            v-for="(item, index) in socialData"
            :key="index"
            href="#"
            class="social-icon"
          >
            <i :class="`fa fa-${item}`"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { getEvents } from "@/services/public/eventsPublic";
import { formatDate } from "@/utils/formatDate";

// State
const eventsRecentPost = ref([]);
const isLoading = ref(false);
const searchQuery = ref("");

const socialData = ref([
  "facebook",
  "instagram",
  "twitter",
  "linkedin",
  "youtube",
]);

// Default placeholder
const defaultPosterUrl = "https://placehold.co/60x60/EBF4FF/7F9CF5?text=Agenda";

// Truncate text helper
const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// Handle image error
const handleImageError = (event) => {
  event.target.src = defaultPosterUrl;
};

// Fetch recent events
const fetchEvents = async () => {
  isLoading.value = true;

  try {
    const params = {
      order: "agenda.created_at DESC",
      limit: 3,
    };

    // Add search filter if exists
    if (searchQuery.value) {
      params.filter = `judul=${searchQuery.value}`;
    }

    const response = await getEvents(params);

    const data = response.data;

    eventsRecentPost.value =
      data?.[0]?.data?.map((item) => ({
        id: item.id_agenda,
        image: item.poster || defaultPosterUrl,
        title: item.judul,
        date: item.tanggal_pelaksanaan,
      })) || [];
  } catch (error) {
    console.error("Error fetching events data:", error);
  } finally {
    isLoading.value = false;
  }
};

// Watch search query for auto-refresh
watch(searchQuery, () => {
  fetchEvents();
});

// Lifecycle
onMounted(() => {
  fetchEvents();
});
</script>

<style scoped>
.hover-primary:hover {
  color: #7366ff !important;
}

.social-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  color: #6c757d;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background-color: #7366ff;
  border-color: #7366ff;
  color: white;
}

.sticky-sidebar {
  position: sticky;
  top: 100px; /* Jarak dari atas saat sticky */
  z-index: 10;
}
</style>
