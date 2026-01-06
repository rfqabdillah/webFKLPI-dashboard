<template>
  <div class="card shadow-sm border-0">
    <div class="card-body">
      <!-- Search -->
      <div class="mb-4">
        <label class="form-label fw-semibold">{{ $t("Search Events") }}</label>
        <div class="input-group">
          <span class="input-group-text bg-light border-end-0">
            <i class="fa fa-search text-muted"></i>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control border-start-0 ps-0"
            :placeholder="$t('Search Events')"
          />
        </div>
      </div>

      <!-- Recent Posts -->
      <div class="mb-4">
        <h6 class="fw-semibold mb-3">{{ $t("Recent Events") }}</h6>

        <div v-if="isLoading" class="text-center py-3">
          <div
            class="spinner-border spinner-border-sm text-primary"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else-if="eventsRecentPost.length === 0" class="text-muted small">
          {{ $t("No recent events") }}
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
                {{
                  truncateText(
                    $i18n.locale === "en" ? item.title_en : item.title,
                    40
                  )
                }}
              </router-link>
              <small class="text-muted">{{
                formatDate(item.date, $i18n.locale)
              }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { getEvents } from "@/services/public/eventsPublic";
import { formatDate } from "@/utils/formatDate";

// Route
const route = useRoute();
const currentAgendaId = computed(() => route.params.id);

// State
const eventsRecentPost = ref([]);
const isLoading = ref(false);
const searchQuery = ref("");

const defaultPosterUrl = "https://placehold.co/60x60/EBF4FF/7F9CF5?text=Agenda";

const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const handleImageError = (event) => {
  event.target.src = defaultPosterUrl;
};
const fetchEvents = async () => {
  isLoading.value = true;

  try {
    const params = {
      order: "agenda.created_at DESC",
      limit: 5,
    };

    if (searchQuery.value) {
      params.filter = `judul=${searchQuery.value}`;
    }

    const response = await getEvents(params);

    const data = response.data;

    const allEvents =
      data?.[0]?.data?.map((item) => ({
        id: item.id_agenda,
        image: item.poster || defaultPosterUrl,
        title: item.judul,
        title_en: item.judul_en || item.judul,
        date: item.tanggal_pelaksanaan,
      })) || [];

    eventsRecentPost.value = allEvents
      .filter((event) => event.id !== currentAgendaId.value)
      .slice(0, 3);
  } catch (error) {
    console.error("Error fetching events data:", error);
  } finally {
    isLoading.value = false;
  }
};

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
</style>
