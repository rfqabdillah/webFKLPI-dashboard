<template>
  <div class="col-12">
    <div class="card">
      <div class="card-header pb-0">
        <h5>Agenda</h5>
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
        <div v-else-if="agendaList.length === 0" class="text-center py-5">
          <i class="fa fa-calendar-o text-muted fa-3x mb-3"></i>
          <p class="text-muted">Tidak ada agenda yang tersedia saat ini.</p>
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
          v-if="totalPages >= 1 && agendaList.length > 0"
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

const router = useRouter();

// State
const agendaList = ref([]);
const isLoading = ref(false);
const error = ref(null);
const currentPage = ref(1);
const itemsPerPage = 9;

// Default placeholder image
const defaultPosterUrl =
  "https://placehold.co/400x250/EBF4FF/7F9CF5?text=Agenda";
const defaultAvatarUrl = "https://placehold.co/40x40/E0E7FF/6366F1?text=User";

// Computed properties
const totalPages = computed(() =>
  Math.ceil(agendaList.value.length / itemsPerPage)
);

const paginatedAgenda = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return agendaList.value.slice(start, end);
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

// Helper function to strip HTML tags for description
const stripHtml = (html) => {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const text = tmp.textContent || tmp.innerText || "";
  // Truncate to 100 characters
  return text.length > 100 ? text.substring(0, 100) + "..." : text;
};

// Map agenda data to card props
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
    photo: defaultAvatarUrl,
    author: "Administrator",
    students: agenda.peserta || 0,
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
      tayang: "Tayang", // Only show published events
    });

    console.log("API Response:", response);

    // Handle response structure: response.data is an array with first element containing data
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

    console.log("Agenda List:", agendaList.value);
  } catch (err) {
    console.error("Error fetching agenda:", err);
    error.value = "Gagal memuat data agenda. Silakan coba lagi.";
  } finally {
    isLoading.value = false;
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // Scroll to top of card container
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const openDetail = (agenda) => {
  router.push(`/agenda-detail/${agenda.id_agenda}`);
};

// Lifecycle
onMounted(() => {
  fetchAgenda();
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
