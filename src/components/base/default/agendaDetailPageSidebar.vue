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

        <div v-if="isLoading">
          <div v-for="n in 3" :key="n" class="d-flex align-items-center mb-3">
            <div
              class="skeleton-img shimmer rounded flex-shrink-0"
              style="width: 60px; height: 60px"
            ></div>
            <div class="ms-3 w-100">
              <div
                class="skeleton-text shimmer mb-2"
                style="width: 90%; height: 14px"
              ></div>
              <div
                class="skeleton-text shimmer"
                style="width: 50%; height: 12px"
              ></div>
            </div>
          </div>
        </div>

        <div v-else-if="eventsRecentPost.length === 0" class="text-muted small">
          {{ $t("No recent Events") }}
        </div>

        <div v-else>
          <div
            v-for="(item, index) in eventsRecentPost"
            :key="index"
            class="d-flex align-items-center mb-3"
          >
            <div class="flex-shrink-0" style="width: 60px; height: 60px">
              <img
                :src="item.image || defaultPosterUrl"
                :alt="item.title"
                class="rounded"
                :style="{
                  width: '100%',
                  height: '100%',
                  objectFit: item.isFallback ? 'contain' : 'cover',
                  padding: item.isFallback ? '8px' : '0',
                  backgroundColor: item.isFallback ? '#f8f9fa' : 'transparent',
                  border: item.isFallback ? '1px solid #e9ecef' : 'none',
                }"
                @error="handleImageError($event, item)"
              />
            </div>
            <div class="ms-3">
              <router-link
                :to="`/event-detail/${item.slug || item.id}`"
                class="fw-medium text-dark text-decoration-none hover-primary d-block"
                style="font-size: 14px"
              >
                {{
                  truncateText(
                    $i18n.locale === "en" ? item.title_en : item.title,
                    40,
                  )
                }}
              </router-link>
              <small class="text-muted">
                <i class="fa fa-calendar me-1"></i>
                {{ formatDate(item.date, $i18n.locale) }}
              </small>
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

import defaultImage from "@/assets/images/logo/Logo_Kementerian_Ketenagakerjaan.png";
const defaultPosterUrl = defaultImage;

const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const handleImageError = (event, item) => {
  event.target.src = defaultPosterUrl;
  item.isFallback = true;
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
        slug: item.slug,
        image: item.poster || defaultPosterUrl,
        isFallback: !item.poster,
        title: item.judul,
        title_en: item.judul_en || item.judul,
        date: item.tanggal_pelaksanaan,
      })) || [];

    eventsRecentPost.value = allEvents
      .filter(
        (event) =>
          event.id !== currentAgendaId.value &&
          event.slug !== currentAgendaId.value,
      )
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

watch(currentAgendaId, () => {
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

.skeleton-img {
  background: #f0f0f0;
}
.skeleton-text {
  background: #f0f0f0;
  border-radius: 4px;
}
.shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
