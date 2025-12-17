<template>
  <div class="col-12">
    <div class="card">
      <div class="card-header pb-3">
        <h5 class="mb-3">Agenda</h5>

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
                placeholder="Cari Agenda"
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

          <!-- Filter by Category -->
          <div class="col-12 col-md-4 col-lg-3">
            <select
              v-model="selectedCategory"
              class="form-select"
              @change="onCategoryChange"
            >
              <option value="">Semua Kategori</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <!-- Results Count -->
          <div
            class="col-12 col-md-2 col-lg-5 d-flex align-items-center justify-content-md-end"
          >
            <span class="text-muted" v-if="!isLoading">
              <strong>{{ filteredAgenda.length }}</strong> agenda ditemukan
            </span>
          </div>
        </div>
      </div>
      <div class="card-body">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Memuat data agenda...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-5">
          <i class="fa fa-exclamation-circle text-danger fa-3x mb-3"></i>
          <p class="text-danger">{{ error }}</p>
          <button class="btn btn-outline-primary" @click="fetchAgenda">
            Coba Lagi
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredAgenda.length === 0" class="text-center py-5">
          <i class="fa fa-calendar-o text-muted fa-3x mb-3"></i>
          <p class="text-muted" v-if="searchQuery || selectedCategory">
            Tidak ada agenda yang sesuai dengan pencarian.
          </p>
          <p class="text-muted" v-else>
            Tidak ada agenda yang tersedia saat ini.
          </p>
          <button
            v-if="searchQuery || selectedCategory"
            class="btn btn-outline-primary"
            @click="resetFilters"
          >
            Reset Filter
          </button>
        </div>

        <!-- Card Grid -->
        <div v-else class="row g-4">
          <div
            v-for="agenda in paginatedAgenda"
            :key="agenda.id_agenda"
            class="col-12 col-md-6 col-lg-4"
          >
            <AgendaCard
              :item="mapAgendaToCard(agenda)"
              @click="openDetail(agenda)"
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
import AgendaCard from "@/components/base/default/agendaCard.vue";
import { getEvents } from "@/services/public/eventsPublic";
import { getEventCategories } from "@/services/general/events/eventsCategories";
import { getEventUsers } from "@/services/general/eventUsers/eventUsers";

const router = useRouter();

// State
const agendaList = ref([]);
const registrantCounts = ref({});
const isLoading = ref(false);
const error = ref(null);
const currentPage = ref(1);
const itemsPerPage = 9;
const searchQuery = ref("");
const selectedCategory = ref("");
const categories = ref([]);

const defaultPosterUrl =
  "https://placehold.co/400x250/EBF4FF/7F9CF5?text=Agenda";

// Computed properties
const filteredAgenda = computed(() => {
  let result = agendaList.value;

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter((agenda) =>
      agenda.judul?.toLowerCase().includes(query)
    );
  }

  if (selectedCategory.value) {
    result = result.filter((agenda) => {
      const catId =
        agenda.kategori_agenda?.id_kategori_agenda ||
        agenda.kategori_agenda?.idakategoriagenda ||
        agenda.id_kategori_agenda;
      return catId === selectedCategory.value;
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

const mapAgendaToCard = (agenda) => {
  return {
    id: agenda.id_agenda,
    image: agenda.poster || defaultPosterUrl,
    tag1: agenda.kategori_agenda?.nama_kategori_agenda || "Umum",
    registration_deadline: agenda.tanggal_batas_pendaftaran,
    implementation_date: agenda.tanggal_pelaksanaan,
    place: agenda.tempat_pelaksanaan || "-",
    title: agenda.judul || "Tanpa Judul",
    desc: stripHtml(agenda.konten),
    students: registrantCounts.value[agenda.id_agenda] || 0,
  };
};

// Methods
const fetchAgenda = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await getEvents({
      sort_by: "tanggal_pelaksanaan",
      sort_direction: "desc",
      tayang: "Tayang",
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
    console.error("Error fetching agenda:", err);
    error.value = "Gagal memuat data agenda. Silakan coba lagi.";
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

const openDetail = (agenda) => {
  router.push(`/agenda-detail/${agenda.id_agenda}`);
};

const fetchCategories = async () => {
  try {
    const response = await getEventCategories();

    let categoryData = [];
    if (
      response.data &&
      Array.isArray(response.data) &&
      response.data[0]?.data
    ) {
      categoryData = response.data[0].data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      categoryData = response.data.data;
    } else if (Array.isArray(response.data)) {
      categoryData = response.data;
    }

    categories.value = categoryData.map((cat) => ({
      id: cat.idakategoriagenda,
      name: cat.namakategoriagenda,
    }));
  } catch (err) {
    console.error("Error fetching categories:", err);
    // Fallback: categories will remain empty
  }
};

const onSearchChange = () => {
  currentPage.value = 1;
};

const onCategoryChange = () => {
  currentPage.value = 1;
};

const clearSearch = () => {
  searchQuery.value = "";
  currentPage.value = 1;
};

const resetFilters = () => {
  searchQuery.value = "";
  selectedCategory.value = "";
  currentPage.value = 1;
};

// Lifecycle
onMounted(() => {
  fetchAgenda();
  fetchCategories();
});
</script>

<style scoped>
.pagination .page-link {
  border: 1px solid #dee2e6;
  color: #6c757d;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s ease;
}

.pagination .page-link:hover {
  background-color: #7366ff;
  border-color: #7366ff;
  color: white;
}

.pagination .page-item.active .page-link {
  background-color: #7366ff;
  border-color: #7366ff;
  color: white;
}

.pagination .page-item.disabled .page-link {
  color: #adb5bd;
  pointer-events: none;
}
</style>
