<template>
  <div class="col-12">
    <div class="card">
      <div class="card-header pb-3">
        <h5 class="mb-3">{{ $t("Agenda Saya") }}</h5>

        <!-- Search & Filter Row -->
        <div class="row g-3">
          <!-- Search by Title -->
          <div class="col-12 col-md-6 col-lg-4">
            <div class="input-group">
              <span class="input-group-text bg-white">
                <i class="fa fa-search text-muted"></i>
              </span>
              <input
                v-model="searchQuery"
                type="text"
                class="form-control"
                :placeholder="$t('Search Programs')"
                @input="onSearchChange"
              />
              <button
                v-if="searchQuery"
                class="btn btn-outline-secondary"
                type="button"
                @click="clearSearch"
              >
                <i class="fa fa-times"></i>
              </button>
            </div>
          </div>

          <!-- Filter by Status -->
          <div class="col-12 col-md-4 col-lg-3">
            <select
              v-model="selectedStatus"
              class="form-select"
              @change="onStatusChange"
            >
              <option value="">{{ $t("All Status") }}</option>
              <option
                v-for="status in statusOptions"
                :key="status.id"
                :value="status.id"
              >
                {{ $i18n.locale === "en" ? status.name_en : status.name }}
              </option>
            </select>
          </div>

          <!-- Results Count -->
          <div
            class="col-12 col-md-2 col-lg-5 d-flex align-items-center justify-content-md-end"
          >
            <span class="text-muted" v-if="!isLoading">
              <strong>{{ filteredAgenda.length }}</strong>
              {{ $t("Programs found") }}
            </span>
          </div>
        </div>
      </div>
      <div class="card-body">
        <!-- Loading State with Skeleton -->
        <div v-if="isLoading" class="row g-4">
          <div v-for="n in 6" :key="n" class="col-12 col-md-6 col-lg-4">
            <div class="card skeleton-card">
              <div class="skeleton-image shimmer"></div>
              <div class="card-body">
                <div class="skeleton-badge shimmer mb-2"></div>
                <div class="skeleton-title shimmer mb-2"></div>
                <div class="skeleton-text shimmer mb-1"></div>
                <div class="skeleton-text shimmer" style="width: 60%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-5">
          <i class="fa fa-exclamation-circle text-danger fa-3x mb-3"></i>
          <p class="text-danger">{{ error }}</p>
          <button class="btn btn-outline-primary" @click="fetchMyAgenda">
            {{ $t("Try Again") }}
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredAgenda.length === 0" class="text-center py-5">
          <i class="fa fa-calendar-o text-muted fa-3x mb-3"></i>
          <p class="text-muted" v-if="searchQuery || selectedStatus">
            {{ $t("No Programs match your search") }}
          </p>
          <p class="text-muted" v-else>
            {{ $t("You have not registered for any Programs yet") }}
          </p>
          <button
            v-if="searchQuery || selectedStatus"
            class="btn btn-outline-primary me-2"
            @click="resetFilters"
          >
            {{ $t("Reset Filter") }}
          </button>
          <router-link
            v-if="!searchQuery && !selectedStatus"
            to="/list-agenda"
            class="btn btn-primary"
          >
            {{ $t("View Programs List") }}
          </router-link>
        </div>

        <div v-else class="row g-4">
          <div
            v-for="item in paginatedAgenda"
            :key="item.id_agenda_pengguna"
            class="col-12 col-md-6 col-lg-4"
          >
            <AgendaCard
              :item="mapAgendaToCard(item)"
              :show-status="true"
              :show-cancel-button="true"
              :is-cancelling="cancellingId === item.id_agenda_pengguna"
              :path="`/agenda-detail/${item.events?.slug || item.slug}`"
              @cancel="handleCancelRegistration"
            />
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="totalPages >= 1 && filteredAgenda.length > 0"
          class="d-flex justify-content-center mt-4"
        >
          <nav aria-label="Page navigation">
            <ul class="pagination mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button
                  class="page-link"
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                >
                  <i class="fa fa-angle-left"></i>
                </button>
              </li>
              <li
                v-for="page in visiblePages"
                :key="page"
                class="page-item"
                :class="{ active: page === currentPage }"
              >
                <button class="page-link" @click="goToPage(page)">
                  {{ page }}
                </button>
              </li>
              <li
                class="page-item"
                :class="{ disabled: currentPage === totalPages }"
              >
                <button
                  class="page-link"
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                >
                  <i class="fa fa-angle-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import Swal from "sweetalert2";
import AgendaCard from "@/components/base/default/agendaCard.vue";
import {
  getEventUsers,
  deleteEventUser,
} from "@/services/general/eventUsers/eventUsers";
import { getStatuses } from "@/services/referensi/status";

const router = useRouter();
const { t, locale } = useI18n();

import {
  STATUS_TERDAFTAR_ID,
  STATUS_DITERIMA_ID,
  STATUS_DITOLAK_ID,
  STATUS_SELESAI_ID,
} from "@/constants/agendaStatus";

// State
const agendaList = ref([]);
const registrantCounts = ref({});
const isLoading = ref(false);
const error = ref(null);
const currentPage = ref(1);
const itemsPerPage = 9;
const searchQuery = ref("");
const selectedStatus = ref("");
const cancellingId = ref(null);
const statusOptions = ref([]);

// Default placeholder image
const defaultPosterUrl =
  "https://placehold.co/400x250/EBF4FF/7F9CF5?text=Agenda";

// Computed properties - filteredAgenda
const filteredAgenda = computed(() => {
  let result = agendaList.value;

  // Filter by search query (title)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter((item) => {
      const agenda = item.events || item;
      const title = agenda.judul || agenda.title || "";
      const titleEn = agenda.judul_en || agenda.title_en || "";
      return (
        title.toLowerCase().includes(query) ||
        titleEn.toLowerCase().includes(query)
      );
    });
  }

  // Filter by status
  if (selectedStatus.value) {
    result = result.filter((item) => {
      const statusId = item.id_status || item.idstatus;
      return statusId === selectedStatus.value;
    });
  }

  return result;
});

const totalPages = computed(() =>
  Math.ceil(filteredAgenda.value.length / itemsPerPage)
);

const paginatedAgenda = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredAgenda.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages.value, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

const stripHtml = (html) => {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const text = tmp.textContent || tmp.innerText || "";
  return text.length > 100 ? text.substring(0, 100) + "..." : text;
};

const mapAgendaToCard = (item) => {
  const agenda = item.events || item;
  const category = item["event-categories"];
  const status = item.status || item.statuses;
  const agendaId = agenda.id_agenda || agenda.idagenda;
  const isEnglish = locale.value === "en";

  // Get status info
  const statusId = item.id_status || item.idstatus;
  const statusName =
    status?.nama_status || status?.namastatus || getStatusNameById(statusId);
  const statusNameEn =
    status?.nama_status_en || status?.namastatus_en || statusName;

  return {
    id: agendaId,
    slug: agenda.slug,
    image: agenda.poster || defaultPosterUrl,
    tag1: isEnglish
      ? category?.nama_kategori_agenda_en ||
        category?.namakategoriagenda_en ||
        category?.nama_kategori_agenda ||
        category?.namakategoriagenda ||
        "General"
      : category?.nama_kategori_agenda ||
        category?.namakategoriagenda ||
        "Umum",
    registration_deadline: agenda.tanggal_batas_pendaftaran,
    implementation_date: agenda.tanggal_pelaksanaan,
    place: agenda.tempat_pelaksanaan || "-",
    title: isEnglish
      ? agenda.judul_en || agenda.judul || "Untitled"
      : agenda.judul || "Tanpa Judul",
    desc: isEnglish
      ? stripHtml(agenda.konten_en || agenda.konten)
      : stripHtml(agenda.konten),
    students: registrantCounts.value[agendaId] || 0,
    locale: locale.value,
    // New fields for status and cancel
    registrationId: item.id_agenda_pengguna || item.idagendapengguna,
    statusId: statusId,
    statusName: statusName,
    statusNameEn: statusNameEn,
  };
};

// Helper function to get status name by ID
const getStatusNameById = (statusId) => {
  switch (statusId) {
    case STATUS_TERDAFTAR_ID:
      return "Terdaftar";
    case STATUS_DITERIMA_ID:
      return "Diterima";
    case STATUS_DITOLAK_ID:
      return "Ditolak";
    case STATUS_SELESAI_ID:
      return "Selesai";
    default:
      return "Terdaftar";
  }
};

// Methods
const fetchMyAgenda = async () => {
  isLoading.value = true;
  error.value = null;

  const userDataString = localStorage.getItem("userData");
  if (!userDataString) {
    error.value = t("Please login first");
    isLoading.value = false;
    return;
  }

  const userData = JSON.parse(userDataString);
  const userId = userData?.data?.[0]?.id_pengguna;

  if (!userId) {
    error.value = t("User data not found. Please login again");
    isLoading.value = false;
    return;
  }

  try {
    const response = await getEventUsers({
      filter: `id_pengguna=${userId}`,
      with: "agenda,status",
    });

    if (
      response.data &&
      Array.isArray(response.data) &&
      response.data[0]?.data
    ) {
      agendaList.value = response.data[0].data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      agendaList.value = response.data.data;
    } else if (Array.isArray(response.data)) {
      agendaList.value = response.data;
    } else {
      agendaList.value = [];
    }

    await fetchRegistrantCounts();
  } catch (err) {
    console.error("Error fetching my agenda:", err);
    error.value = t("Failed to load your events. Please try again");
  } finally {
    isLoading.value = false;
  }
};

const fetchRegistrantCounts = async () => {
  try {
    const response = await getEventUsers();
    const eventUsers = response.data?.[0]?.data || response.data?.data || [];

    const counts = {};
    eventUsers.forEach((eu) => {
      const agendaId = eu.id_agenda || eu.idagenda;
      if (agendaId) {
        counts[agendaId] = (counts[agendaId] || 0) + 1;
      }
    });

    registrantCounts.value = counts;
  } catch (err) {
    console.error("Error fetching registrant counts:", err);
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const openDetail = (item) => {
  const agenda = item.events || item;
  const identifier = agenda.slug || agenda.id_agenda || agenda.idagenda;
  if (identifier) {
    router.push(`/agenda-detail/${identifier}`);
  }
};

// Fetch status options from API
const fetchStatusOptions = async () => {
  try {
    const res = await getStatuses({ limit: 100 });
    const responseData = Array.isArray(res.data) ? res.data[0] : res.data;
    const allStatuses = responseData?.data || [];

    // Filter hanya status yang relevan untuk pendaftaran agenda
    const relevantStatusIds = [
      STATUS_TERDAFTAR_ID,
      STATUS_DITERIMA_ID,
      STATUS_DITOLAK_ID,
      STATUS_SELESAI_ID,
    ];

    statusOptions.value = allStatuses
      .filter((s) => {
        const id = s.id_status || s.idstatus;
        return relevantStatusIds.includes(id);
      })
      .map((s) => ({
        id: s.id_status || s.idstatus,
        name: s.nama_status || s.namastatus || "Unknown",
        name_en:
          s.nama_status_en ||
          s.namastatus_en ||
          s.nama_status ||
          s.namastatus ||
          "Unknown",
      }));
  } catch (err) {
    console.error("Error fetching status options:", err);
  }
};

// Search and filter handlers
const onSearchChange = () => {
  currentPage.value = 1;
};

const onStatusChange = () => {
  currentPage.value = 1;
};

const clearSearch = () => {
  searchQuery.value = "";
  currentPage.value = 1;
};

const resetFilters = () => {
  searchQuery.value = "";
  selectedStatus.value = "";
  currentPage.value = 1;
};

// Handle cancel registration from card
const handleCancelRegistration = async ({ registrationId, title }) => {
  if (!registrationId) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: t("Registration data not found"),
      confirmButtonColor: "#7366ff",
    });
    return;
  }

  const result = await Swal.fire({
    icon: "warning",
    title: t("Cancel Registration"),
    html: `${t(
      "Are you sure you want to cancel registration for event"
    )}:<br><br><strong>${title}</strong>?`,
    showCancelButton: true,
    reverseButtons: true,
    confirmButtonText: t("Yes Cancel"),
    cancelButtonText: t("No"),
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#efefef",
  });

  if (!result.isConfirmed) return;

  // Find the item to get the id_agenda_pengguna
  const item = agendaList.value.find(
    (a) => (a.id_agenda_pengguna || a.idagendapengguna) === registrationId
  );

  if (!item) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: t("Registration data not found"),
      confirmButtonColor: "#7366ff",
    });
    return;
  }

  cancellingId.value = item.id_agenda_pengguna || item.idagendapengguna;

  try {
    await deleteEventUser(registrationId);

    Swal.fire({
      icon: "success",
      title: t("Success") + "!",
      text: t("Your registration has been cancelled"),
      confirmButtonColor: "#7366ff",
    });

    // Refresh the agenda list
    await fetchMyAgenda();
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
    cancellingId.value = null;
  }
};

// Lifecycle
onMounted(() => {
  fetchMyAgenda();
  fetchStatusOptions();
});
</script>

<style scoped>
.badge {
  font-size: 12px;
}
/* Pagination Styles */
.pagination .page-link {
  border: 1px solid #dee2e6;
  color: #6c757d;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s ease;
}

.pagination .page-link:hover {
  background-color: #15406ae6;
  border-color: #15406ae6;
  color: white;
}

.pagination .page-item.active .page-link {
  background-color: #15406ae6;
  border-color: #15406ae6;
  color: white;
}

.pagination .page-item.disabled .page-link {
  color: #adb5bd;
  pointer-events: none;
}

/* Skeleton Loader Styles */
.skeleton-card {
  border-radius: 12px;
  overflow: hidden;
}
.skeleton-image {
  height: 180px;
  background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
  background-size: 200% 100%;
}
.skeleton-badge {
  width: 80px;
  height: 24px;
  border-radius: 12px;
  background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
  background-size: 200% 100%;
}
.skeleton-title {
  width: 70%;
  height: 20px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
  background-size: 200% 100%;
}
.skeleton-text {
  width: 100%;
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
  background-size: 200% 100%;
}
.shimmer {
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
