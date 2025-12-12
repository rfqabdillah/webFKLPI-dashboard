<template>
  <div class="col-12">
    <div class="card">
      <div class="card-header pb-0">
        <h5>Agenda Saya</h5>
        <p class="text-muted mb-0">Daftar agenda yang telah Anda ikuti</p>
      </div>
      <div class="card-body">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Memuat agenda Anda...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-5">
          <i class="fa fa-exclamation-circle text-danger fa-3x mb-3"></i>
          <p class="text-danger">{{ error }}</p>
          <button class="btn btn-outline-primary" @click="fetchMyAgenda">
            Coba Lagi
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="agendaList.length === 0" class="text-center py-5">
          <i class="fa fa-calendar-o text-muted fa-3x mb-3"></i>
          <p class="text-muted">Anda belum mendaftar agenda apapun.</p>
          <router-link to="/list-agenda" class="btn btn-primary">
            Lihat Daftar Agenda
          </router-link>
        </div>

        <!-- Card Grid -->
        <div v-else class="row g-4">
          <div
            v-for="item in paginatedAgenda"
            :key="item.id_agenda_pengguna"
            class="col-12 col-md-6 col-lg-4"
          >
            <AgendaCard
              :item="mapAgendaToCard(item)"
              @click="openDetail(item)"
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
import { getEventUsers } from "@/services/general/eventUsers/eventUsers";

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
  return text.length > 100 ? text.substring(0, 100) + "..." : text;
};

// Map agenda data to card props
const mapAgendaToCard = (item) => {
  // item contains events relation data (from API response)
  const agenda = item.events || item;
  const category = item["event-categories"];

  return {
    id: agenda.id_agenda,
    image: agenda.poster || defaultPosterUrl,
    tag1:
      category?.nama_kategori_agenda || category?.namakategoriagenda || "Umum",
    registration_deadline: agenda.tanggal_batas_pendaftaran,
    implementation_date: agenda.tanggal_pelaksanaan,
    place: agenda.tempat_pelaksanaan || "-",
    title: agenda.judul || "Tanpa Judul",
    desc: stripHtml(agenda.konten),
    photo: agenda.pengguna?.foto || item.pengguna?.foto || defaultAvatarUrl,
    author:
      agenda.pengguna?.penulis || item.pengguna?.penulis || "Administrator",
    students: agenda.peserta || 0,
  };
};

// Methods
const fetchMyAgenda = async () => {
  isLoading.value = true;
  error.value = null;

  // Get current user ID from localStorage
  const userDataString = localStorage.getItem("userData");
  if (!userDataString) {
    error.value = "Silakan login terlebih dahulu.";
    isLoading.value = false;
    return;
  }

  const userData = JSON.parse(userDataString);
  const userId = userData?.data?.[0]?.id_pengguna;

  if (!userId) {
    error.value = "Data pengguna tidak ditemukan. Silakan login ulang.";
    isLoading.value = false;
    return;
  }

  try {
    const response = await getEventUsers({
      filter: `id_pengguna=${userId}`,
      with: "agenda,status",
    });

    console.log("My Agenda Response:", response);

    // Handle response structure
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

    console.log("My Agenda List:", agendaList.value);
  } catch (err) {
    console.error("Error fetching my agenda:", err);
    error.value = "Gagal memuat agenda Anda. Silakan coba lagi.";
  } finally {
    isLoading.value = false;
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const openDetail = (item) => {
  const agendaId = item.events?.id_agenda || item.id_agenda;
  if (agendaId) {
    router.push(`/agenda-detail/${agendaId}`);
  }
};

// Lifecycle
onMounted(() => {
  fetchMyAgenda();
});
</script>

<style scoped>
.badge {
  font-size: 12px;
}
</style>
